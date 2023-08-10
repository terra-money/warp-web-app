import { useMemo } from 'react';
import { WarpSdk } from '@terra-money/warp-sdk';
import {
  LCDClient as InjectiveLCDClient,
  LCDClientConfig as InjectiveLCDClientConfig,
} from '@terra-money/feather.js-injective';
import { useLocalWallet } from '@terra-money/apps/hooks/useLocalWallet';
import { injectiveNetworks, useChainSelector } from './useChainSelector';

export const useWarpSdk = () => {
  const wallet = useLocalWallet();

  const { selectedChain } = useChainSelector();

  const chainName = selectedChain.name;

  return useMemo(() => {
    if (chainName === 'injective') {
      const lcd = new InjectiveLCDClient(injectiveNetworks as Record<string, InjectiveLCDClientConfig>);

      return new WarpSdk(
        {
          connectedWallet: {
            lcd: lcd as any,
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
