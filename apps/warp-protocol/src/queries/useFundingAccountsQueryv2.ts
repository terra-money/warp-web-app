import { useLocalWallet, useWarpSdkv2 } from '@terra-money/apps/hooks';
import { useQuery, UseQueryResult } from 'react-query';
import { QUERY_KEY } from './queryKey';
import { warp_account_tracker } from '@terra-money/warp-sdk-v2';

type FundingAccountsQueryv2Opts = warp_account_tracker.QueryFundingAccountsMsg & {
  enabled?: boolean;
};

export const useFundingAccountsQueryv2 = (
  opts: FundingAccountsQueryv2Opts
): UseQueryResult<warp_account_tracker.FundingAccount[] | undefined> => {
  const enabled = opts.enabled ?? true;
  const wallet = useLocalWallet();
  const sdk = useWarpSdkv2();

  const query = useQuery(
    [QUERY_KEY.FUNDING_ACCOUNTS_V2, wallet.chainId, JSON.stringify(opts)],
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
