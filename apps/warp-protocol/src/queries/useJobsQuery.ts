import { useLocalWallet } from '@terra-money/apps/hooks';
import { useQuery, UseQueryResult } from 'react-query';
import { warp_controller } from 'types';
import { QUERY_KEY } from './queryKey';
import { Job } from 'types/job';
import { useWarpSdk } from '@terra-money/apps/hooks';

type JobsQueryOpts = warp_controller.QueryJobsMsg & {
  enabled?: boolean;
};

export const useJobsQuery = (opts: JobsQueryOpts = {}): UseQueryResult<Job[] | undefined> => {
  const wallet = useLocalWallet();
  const sdk = useWarpSdk();
  const { enabled = true, ...queryOpts } = opts;

  const query = useQuery(
    [QUERY_KEY.JOBS, wallet.chainId, JSON.stringify(opts)],
    async () => {
      const jobs = await sdk.jobs(queryOpts);

      return jobs.map((j) => new Job(j));
    },
    {
      refetchOnMount: false,
      keepPreviousData: false,
      enabled,
    }
  );

  return query as UseQueryResult<Job[] | undefined>;
};
