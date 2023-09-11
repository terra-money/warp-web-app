import { LCDClient, LCDClientConfig } from '@terra-money/feather.js';
import { InfoResponse, useWallet } from '@terra-money/wallet-kit';
import { ReactNode, createContext, useContext, useMemo, useCallback, useEffect, useState } from 'react';
import { ReactComponent as TerraIcon } from 'components/assets/Terra.svg';
import { ReactComponent as InjectiveIcon } from 'components/assets/Injective.svg';
import { ReactComponent as NeutronIcon } from 'components/assets/Neutron.svg';
import {
  ChainMetadata as SdkChainMetadata,
  TERRA_CHAIN,
  ChainName,
  ChainModule,
  NetworkName,
} from '@terra-money/warp-sdk';
import { useLocalStorage } from 'usehooks-ts';

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
      return { ...sdkMetadata, icon: <InjectiveIcon /> };
    case 'terra':
      return { ...sdkMetadata, icon: <TerraIcon /> };
    case 'neutron':
      return { ...sdkMetadata, icon: <NeutronIcon /> };
  }
};

const networkName = (networks: InfoResponse): NetworkName => ('pisco-1' in networks ? 'testnet' : 'mainnet');

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
  const { network } = useWallet();

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
      supportedChains: ChainModule.supportedChains().map(getChainMetadata),
    };

    return ret;
  }, [selectedChainId, selectedChainMetadata, lcdClientConfig, setSelectedChain, network]);

  return <ChainSelectorContext.Provider value={value}>{children}</ChainSelectorContext.Provider>;
};

export { ChainSelectorProvider, useChainSelector };
