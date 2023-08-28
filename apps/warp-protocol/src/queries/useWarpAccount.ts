import { useLocalWallet } from '@terra-money/apps/hooks';
import { useQuery, UseQueryResult } from 'react-query';
import { warp_controller } from '@terra-money/warp-sdk';
import { QUERY_KEY } from './queryKey';
import { useWarpSdk } from '@terra-money/apps/hooks';

export const useWarpAccount = (): UseQueryResult<warp_controller.Account | undefined> => {
  const { connectedWallet, chainId } = useLocalWallet();
  const sdk = useWarpSdk();

  const query = useQuery(
    [QUERY_KEY.WARP_ACCOUNT, chainId, connectedWallet?.walletAddress],
    async () => {
      if (!connectedWallet) {
        return undefined;
      }

      const account = await sdk.account(connectedWallet.walletAddress);

      return account;
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  return query as UseQueryResult<warp_controller.Account | undefined>;
};
