import { useLocalWallet } from '@terra-money/apps/hooks';
import { useQuery, UseQueryResult } from 'react-query';
import { QUERY_KEY } from './queryKey';
import { useWarpSdkv2 } from '@terra-money/apps/hooks';
import { Job, warp_controller } from '@terra-money/warp-sdk-v2';

type JobsQueryOpts = warp_controller.QueryJobsMsg & {
  enabled?: boolean;
};

export const useJobsQueryv2 = (opts: JobsQueryOpts = {}): UseQueryResult<Job[] | undefined> => {
  const wallet = useLocalWallet();
  const sdk = useWarpSdkv2();
  const { enabled = true, ...queryOpts } = opts;

  const query = useQuery(
    [QUERY_KEY.JOBS_V2, wallet.chainId, JSON.stringify(opts)],
    async () => {
      const jobs = await sdk.jobs(queryOpts);

      return jobs;
    },
    {
      refetchOnMount: false,
      keepPreviousData: false,
      enabled,
    }
  );

  return query as UseQueryResult<Job[] | undefined>;
};
