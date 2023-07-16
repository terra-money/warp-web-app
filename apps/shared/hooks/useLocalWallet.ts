import { LCDClient, LCDClientConfig } from '@terra-money/feather.js';
import { ConnectResponse, useConnectedWallet, useLcdClient, useWallet, WalletResponse } from '@terra-money/wallet-kit';
import { useMemo } from 'react';
import { ChainMetadata, useChainSelector } from './useChainSelector';

export type ConnectedLocalWallet = ConnectResponse & {
  walletAddress: string;
};

export type LocalWallet = {
  connectedWallet?: ConnectedLocalWallet;
  wallet: WalletResponse;
  lcdClientConfig: LCDClientConfig;
  chainId: string;
  walletAddress: string;
  chain: ChainMetadata;
  lcd: LCDClient;
};

export const useLocalWallet = (): LocalWallet => {
  const connectedWallet = useConnectedWallet();
  const wallet = useWallet();

  const { lcdClientConfig, selectedChainId, selectedChain } = useChainSelector();
  const lcd = useLcdClient();

  return useMemo(() => {
    return {
      connectedWallet: connectedWallet
        ? {
            ...connectedWallet,
            walletAddress: connectedWallet.addresses[selectedChainId],
          }
        : undefined,
      lcdClientConfig,
      // TODO: verify these two are non null when connected
      chainId: selectedChainId,
      chain: selectedChain,
      wallet: wallet,
      // TODO: check if this works
      walletAddress: connectedWallet ? connectedWallet.addresses[selectedChainId] : '',
      lcd,
    };
  }, [connectedWallet, wallet, lcdClientConfig, lcd]);
};
