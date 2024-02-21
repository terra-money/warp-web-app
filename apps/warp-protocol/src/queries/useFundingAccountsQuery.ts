import { useLocalWallet } from '@terra-money/apps/hooks';
import { useQuery, UseQueryResult } from 'react-query';
import { QUERY_KEY } from './queryKey';
import { useWarpSdk } from '@terra-money/apps/hooks';
import { warp_account_tracker } from '@terra-money/warp-sdk';

type FundingAccountsQueryOpts = warp_account_tracker.QueryFundingAccountsMsg & {
  enabled?: boolean;
};

export const useFundingAccountsQuery = (
  opts: FundingAccountsQueryOpts
): UseQueryResult<warp_account_tracker.FundingAccount[] | undefined> => {
  const enabled = opts.enabled ?? true;
  const wallet = useLocalWallet();
  const sdk = useWarpSdk();

  const query = useQuery(
    [QUERY_KEY.FUNDING_ACCOUNTS, wallet.chainId, JSON.stringify(opts)],
    async () => {
      const response = await sdk.fundingAccounts(opts);

      return response.funding_accounts;
    },
    {
      refetchOnMount: false,
      keepPreviousData: false,
      enabled,
    }
  );

  return query as UseQueryResult<warp_account_tracker.FundingAccount[] | undefined>;
};
