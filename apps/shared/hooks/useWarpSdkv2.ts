import { useMemo } from 'react';
import { WarpSdk } from '@terra-money/warp-sdk-v2';
import { useLocalWallet } from '@terra-money/apps/hooks/useLocalWallet';

export const useWarpSdkv2 = () => {
  const wallet = useLocalWallet();

  return useMemo(() => {
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
