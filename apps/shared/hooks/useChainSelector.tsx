import { LCDClientConfig } from '@terra-money/feather.js';
import { useWallet } from '@terra-money/wallet-kit';
import { ReactNode, createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import { ReactComponent as TerraIcon } from 'components/assets/Terra.svg';
import { ReactComponent as InjectiveIcon } from 'components/assets/Injective.svg';
import { ChainMetadata as SdkChainMetadata, TERRA_CHAIN, ChainName, ChainModule } from '@terra-money/warp-sdk';

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

const ChainSelectorProvider = (props: ChainSelectorProviderProps) => {
  const { children } = props;
  const { network } = useWallet();

  const [selectedChainMetadata, setSelectedChainMetadata] = useState<ChainMetadata>(getChainMetadata(TERRA_CHAIN));
  const [localState, setLocalState] = useState<{ selectedChainId: string; lcdClientConfig: LCDClientConfig }>({
    selectedChainId: TERRA_CHAIN.mainnet,
    lcdClientConfig: network[TERRA_CHAIN.mainnet],
  });

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
    },
    [setSelectedChainMetadata, chainModule, network]
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
      selectedChain: selectedChainMetadata,
      lcdClientConfig,
      setSelectedChain,
      supportedChains: chainModule.supportedChains().map(getChainMetadata),
    };

    return ret;
  }, [selectedChainId, selectedChainMetadata, lcdClientConfig, chainModule, setSelectedChain]);

  return <ChainSelectorContext.Provider value={value}>{children}</ChainSelectorContext.Provider>;
};

export { ChainSelectorProvider, useChainSelector };
