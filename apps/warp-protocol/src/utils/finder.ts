import { useLocalWallet } from '@terra-money/apps/hooks';
import { useCallback } from 'react';

const terraFinderTxUrl = (network: string, txHash: string) => `https://terrasco.pe/${network}/tx/${txHash}`;
const injectiveFinderTxUrl = (network: string, txHash: string) =>
  network === `mainnet`
    ? `https://explorer.injective.network/transaction/${txHash}`
    : `https://testnet.explorer.injective.network/transaction/${txHash}`;
const neutronFinderTxUrl = (chainId: string, txHash: string) => `https://neutron.celat.one/${chainId}/txs/${txHash}`;

export const useFinderTxUrl = () => {
  const { connectedWallet, chain, chainId } = useLocalWallet();

  return useCallback(
    (txHash: string) => {
      if (!connectedWallet) {
        return undefined;
      }

      switch (chain.name) {
        case 'terra':
          return terraFinderTxUrl(connectedWallet.network!, txHash);
        case 'neutron':
          return neutronFinderTxUrl(chainId, txHash);
        case 'injective':
          return injectiveFinderTxUrl(connectedWallet.network!, txHash);
      }
    },
    [connectedWallet, chainId, chain]
  );
};
