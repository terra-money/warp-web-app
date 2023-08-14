import { useMemo } from 'react';
import { WarpSdk } from '@terra-money/warp-sdk';
import { useLocalWallet } from '@terra-money/apps/hooks/useLocalWallet';
import { injectiveNetworks, useChainSelector } from './useChainSelector';
import { LCDClient, LCDClientConfig } from '@terra-money/feather.js';

export const useWarpSdk = () => {
  const wallet = useLocalWallet();

  const { selectedChain } = useChainSelector();

  const chainName = selectedChain.name;

  return useMemo(() => {
    if (chainName === 'injective') {
      const lcd = new LCDClient(injectiveNetworks as Record<string, LCDClientConfig>);

      return new WarpSdk(
        {
          connectedWallet: {
            lcd: lcd,
            wallet: wallet.wallet,
          },
        },
        wallet.lcdClientConfig
      );
    }

    return new WarpSdk(
      {
        connectedWallet: {
          lcd: wallet.lcd,
          wallet: wallet.wallet,
        },
      },
      wallet.lcdClientConfig
    );
  }, [wallet, chainName]);
};
