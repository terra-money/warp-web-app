import { LCDClient, LCDClientConfig } from '@terra-money/feather.js';
import { InfoResponse, useWallet } from '@terra-money/wallet-kit';
import { ReactNode, createContext, useContext, useMemo, useCallback, useEffect, useState } from 'react';
import { ReactComponent as TerraIcon } from 'components/assets/Terra.svg';
import { ReactComponent as InjectiveIcon } from 'components/assets/Injective.svg';
import { ReactComponent as NeutronIcon } from 'components/assets/Neutron.svg';
import { ReactComponent as NibiruIcon } from 'components/assets/Nibiru.svg';
import { ReactComponent as MigalooIcon } from 'components/assets/Migaloo.svg';
import { ReactComponent as OsmoIcon } from 'components/assets/Osmo.svg';
import {
  ChainMetadata as SdkChainMetadata,
  TERRA_CHAIN,
  ChainName,
  ChainModule,
  NetworkName,
} from '@terra-money/warp-sdk';
import { useLocalStorage } from 'usehooks-ts';

import styles from './ChainSelector.module.sass';

export type ChainMetadata = SdkChainMetadata & {
  icon: ReactNode;
};

type ChainSelectorContextState = {
  selectedChainId: string;
  selectedChain: ChainMetadata;
  lcdClientConfig: LCDClientConfig;
  setSelectedChain: (chain: ChainName) => void;
  supportedChains: ChainMetadata[];
  lcd: LCDClient;
};

const getChainMetadata = (sdkMetadata: SdkChainMetadata) => {
  switch (sdkMetadata.name) {
    case 'injective':
      return { ...sdkMetadata, icon: <InjectiveIcon className={styles.chain_icon} /> };
    case 'terra':
      return { ...sdkMetadata, icon: <TerraIcon className={styles.chain_icon} /> };
    case 'neutron':
      return { ...sdkMetadata, icon: <NeutronIcon className={styles.chain_icon} /> };
    case 'nibiru':
      return { ...sdkMetadata, icon: <NibiruIcon className={styles.chain_icon} /> };
    case 'migaloo':
      return { ...sdkMetadata, icon: <MigalooIcon className={styles.chain_icon} /> };
    case 'osmosis':
      return { ...sdkMetadata, icon: <OsmoIcon className={styles.chain_icon} /> };
  }
};

const networkName = (networks: InfoResponse): NetworkName => ('pisco-1' in networks ? 'testnet' : 'mainnet');

// TODO: required for mainnet flicker not to break app - remove when station mainnet supported is added
const addNibiru = (networks: InfoResponse): InfoResponse => {
  if (networkName(networks) === 'mainnet') {
    return {
      ...networks,
      'nibiru-itn-2': {
        chainID: 'nibiru-itn-2',
        lcd: 'https://lcd.itn-2.nibiru.fi',
        gasAdjustment: 1.75,
        gasPrices: {
          unibi: 0.15,
        },
        prefix: 'nibi',
      },
    };
  }

  return networks;
};

const ChainSelectorContext = createContext<ChainSelectorContextState | undefined>(undefined);

const useChainSelector = () => {
  const context = useContext(ChainSelectorContext);
  if (context === undefined) {
    throw Error('The ChainSelectorContext has not been defined.');
  }
  return context;
};

interface ChainSelectorProviderProps {
  children: ReactNode;
}

const ChainSelectorProvider = (props: ChainSelectorProviderProps) => {
  const { children } = props;
  const { network: prevNetwork } = useWallet();

  const network = useMemo(() => addNibiru(prevNetwork), [prevNetwork]);

  // console.log({ network })

  const [selectedChainMetadata, setSelectedChainMetadata] = useLocalStorage<SdkChainMetadata>(
    '__warp_selected_chain',
    TERRA_CHAIN
  );

  const [localState, setLocalState] = useState<{ selectedChainId: string; lcdClientConfig: LCDClientConfig }>({
    selectedChainId: selectedChainMetadata.mainnet,
    lcdClientConfig: network[selectedChainMetadata.mainnet],
  });

  const { selectedChainId, lcdClientConfig } = localState;

  const setSelectedChain = useCallback(
    (chainName: ChainName) => {
      const metadata = ChainModule.chainMetadata(chainName);
      // check if testnet or mainnet by useWallet's network
      const chainId = networkName(network) === 'testnet' ? metadata.testnet : metadata.mainnet;

      setSelectedChainMetadata(getChainMetadata(metadata));
      setLocalState({ selectedChainId: chainId, lcdClientConfig: network[chainId] });
    },
    [setSelectedChainMetadata, network, setLocalState]
  );

  useEffect(() => {
    // network changed in useWallet + hack for empty networks object returned by useWallet, remove when fixed
    if (!(selectedChainId in network) && Object.keys(network).length > 1) {
      setSelectedChain(selectedChainMetadata.name);
      return;
    }
  }, [network, selectedChainMetadata, setSelectedChain, selectedChainId]);

  const value = useMemo<ChainSelectorContextState>(() => {
    const ret = {
      selectedChainId,
      selectedChain: getChainMetadata(selectedChainMetadata),
      lcdClientConfig,
      lcd: new LCDClient(network),
      setSelectedChain,
      supportedChains: ChainModule.supportedChains()
        .map(getChainMetadata)
        .filter((c) => {
          if (
            (c.name === 'nibiru' && networkName(network) === 'mainnet') ||
            (c.name === 'migaloo' && networkName(network) === 'mainnet')
          ) {
            return false;
          }

          return true;
        }),
    };

    return ret;
  }, [selectedChainId, selectedChainMetadata, lcdClientConfig, setSelectedChain, network]);

  return <ChainSelectorContext.Provider value={value}>{children}</ChainSelectorContext.Provider>;
};

export { ChainSelectorProvider, useChainSelector };
