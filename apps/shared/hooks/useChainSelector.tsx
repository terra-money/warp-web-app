import { LCDClientConfig } from '@terra-money/feather.js';
import { useConnectedWallet, useWallet } from '@terra-money/wallet-kit';
import { ReactNode, createContext, useContext, useMemo, useState, useCallback } from 'react';
import { ReactComponent as TerraIcon } from 'components/assets/Terra.svg';
import { ChainMetadata as SdkChainMetadata, TERRA_CHAIN, ChainName, NetworkName } from '@terra-money/warp-sdk';
import { useWarpSdk } from './useWarpSdk';

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
      return { ...sdkMetadata, icon: <TerraIcon /> };
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
  const connectedWallet = useConnectedWallet();

  const [selectedChain, setSelectedChainMetadata] = useState<ChainMetadata>(getChainMetadata(TERRA_CHAIN));
  const [selectedChainId, setSelectedChainId] = useState<string>(TERRA_CHAIN.mainnet);

  const lcdClientConfig = network[selectedChainId] as LCDClientConfig;

  const sdk = useWarpSdk();

  const setSelectedChain = useCallback(
    (chainName: ChainName) => {
      const metadata = sdk.chain.chainMetadata(chainName);

      let chainId;

      if (connectedWallet) {
        chainId = metadata[connectedWallet.network as NetworkName];
      } else {
        chainId = metadata.mainnet;
      }

      setSelectedChainMetadata(getChainMetadata(metadata));
      setSelectedChainId(chainId);
    },
    [setSelectedChainMetadata, setSelectedChainId, connectedWallet, sdk]
  );

  const value = useMemo<ChainSelectorContextState>(() => {
    return {
      selectedChainId,
      selectedChain,
      lcdClientConfig,
      setSelectedChain,
      supportedChains: sdk.chain.supportedChains().map(getChainMetadata),
    };
  }, [selectedChainId, selectedChain, lcdClientConfig, sdk]);

  return <ChainSelectorContext.Provider value={value}>{children}</ChainSelectorContext.Provider>;
};

export { ChainSelectorProvider, useChainSelector };
