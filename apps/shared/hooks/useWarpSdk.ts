import { useMemo } from 'react';
import { WarpSdk } from '@terra-money/warp-sdk';
import { useLocalWallet } from '@terra-money/apps/hooks/useLocalWallet';

export const useWarpSdk = () => {
  const wallet = useLocalWallet();

  return useMemo(() => {
    if (!wallet) {
      throw new Error('Wallet not connected.');
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
  }, [wallet]);
};
