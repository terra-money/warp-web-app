import { LCDClientConfig } from '@terra-money/feather.js';
import { InfoResponse, useConnectedWallet, useWallet } from '@terra-money/wallet-kit';
import { ReactNode, createContext, useContext, useMemo, useCallback, useEffect } from 'react';
import { ReactComponent as TerraIcon } from 'components/assets/Terra.svg';
import { ReactComponent as InjectiveIcon } from 'components/assets/Injective.svg';
import { ChainMetadata as SdkChainMetadata, TERRA_CHAIN, ChainName, ChainModule } from '@terra-money/warp-sdk';
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
};

const getChainMetadata = (sdkMetadata: SdkChainMetadata) => {
  switch (sdkMetadata.name) {
    case 'injective':
      return { ...sdkMetadata, icon: <InjectiveIcon /> };
    case 'terra':
      return { ...sdkMetadata, icon: <TerraIcon /> };
  }
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

export const injectiveNetworks: Record<string, LCDClientConfig> = {
  'injective-888': {
    chainID: 'injective-888',
    lcd: 'https://k8s.testnet.lcd.injective.network',
    gasAdjustment: 1.75,
    gasPrices: {
      INJ: 0.05,
    },
    // prefix: 'inj1',
    prefix: 'inj',
  },
  'injective-1': {
    chainID: 'injective-1',
    lcd: 'https://lcd.injective.network',
    gasAdjustment: 1.75,
    gasPrices: {
      INJ: 0.05,
    },
    // prefix: 'inj',
    prefix: 'inj2',
  },
};

const ChainSelectorProvider = (props: ChainSelectorProviderProps) => {
  const { children } = props;
  const { network: prevNetwork, disconnect } = useWallet();
  const connectedWallet = useConnectedWallet();

  const network = useMemo<InfoResponse>(() => ({ ...prevNetwork, ...injectiveNetworks }), [prevNetwork]);

  const [selectedChainMetadata, setSelectedChainMetadata] = useLocalStorage<SdkChainMetadata>(
    '__warp_selected_chain',
    TERRA_CHAIN
  );

  const [localState, setLocalState] = useLocalStorage<{ selectedChainId: string; lcdClientConfig: LCDClientConfig }>(
    '__warp_selected_chain_local_state',
    {
      selectedChainId: TERRA_CHAIN.mainnet,
      lcdClientConfig: network[TERRA_CHAIN.mainnet],
    }
  );

  const { selectedChainId, lcdClientConfig } = localState;

  const chainModule = useMemo(() => {
    return new ChainModule(lcdClientConfig);
  }, [lcdClientConfig]);

  const setSelectedChain = useCallback(
    (chainName: ChainName) => {
      const metadata = chainModule.chainMetadata(chainName);
      // check if testnet or mainnet by useWallet's network
      const chainId = 'pisco-1' in network ? metadata.testnet : metadata.mainnet;

      setSelectedChainMetadata(getChainMetadata(metadata));
      setLocalState({ selectedChainId: chainId, lcdClientConfig: network[chainId] });

      if (metadata.name === 'injective' && connectedWallet) {
        disconnect();
      }
    },
    [setSelectedChainMetadata, chainModule, network, disconnect, connectedWallet, setLocalState]
  );

  useEffect(() => {
    // network changed in useWallet
    if (!(selectedChainId in network)) {
      setSelectedChain(selectedChainMetadata.name);
      return;
    }
  }, [network, selectedChainMetadata, setSelectedChain, selectedChainId]);

  const value = useMemo<ChainSelectorContextState>(() => {
    const ret = {
      selectedChainId,
      selectedChain: getChainMetadata(selectedChainMetadata),
      lcdClientConfig,
      setSelectedChain,
      supportedChains: chainModule.supportedChains().map(getChainMetadata),
    };

    return ret;
  }, [selectedChainId, selectedChainMetadata, lcdClientConfig, chainModule, setSelectedChain]);

  return <ChainSelectorContext.Provider value={value}>{children}</ChainSelectorContext.Provider>;
};

export { ChainSelectorProvider, useChainSelector };
