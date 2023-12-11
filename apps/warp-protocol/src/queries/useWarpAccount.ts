import { useLocalWallet } from '@terra-money/apps/hooks';
import { useQuery, UseQueryResult } from 'react-query';
import { warp_account_tracker } from '@terra-money/warp-sdk';
import { QUERY_KEY } from './queryKey';

export const useWarpAccount = (): UseQueryResult<warp_account_tracker.Account | undefined> => {
  const { connectedWallet, chainId } = useLocalWallet();

  const query = useQuery(
    [QUERY_KEY.WARP_ACCOUNT, chainId, connectedWallet?.walletAddress],
    async () => {
      if (!connectedWallet) {
        return undefined;
      }

      // const account = await sdk.legacyAccount(connectedWallet.walletAddress);

      // return account;
      return undefined;
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  return query as UseQueryResult<warp_account_tracker.Account | undefined>;
};
