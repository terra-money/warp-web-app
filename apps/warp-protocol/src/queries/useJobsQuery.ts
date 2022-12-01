import { useContractAddress } from '@terra-money/apps/hooks';
import { CW20Addr } from '@terra-money/apps/types';
import { NetworkInfo, useConnectedWallet } from '@terra-money/wallet-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { warp_controller } from 'types';
import { QUERY_KEY } from './queryKey';
import { contractQuery } from '@terra-money/apps/queries';
import { Job } from 'types/job';

const fetchJobs = async (
  network: NetworkInfo,
  contractAddress: CW20Addr,
  opts: warp_controller.QueryJobsMsg
): Promise<warp_controller.Job[]> => {
  const response = await contractQuery<
    Extract<warp_controller.QueryMsg, { query_jobs: {} }>,
    warp_controller.JobsResponse
  >(network, contractAddress, { query_jobs: opts }, { jobs: [], total_count: 0 });

  return response.jobs;
};

type JobsQueryOpts = warp_controller.QueryJobsMsg & {
  enabled?: boolean;
};

export const useJobsQuery = (opts: JobsQueryOpts = {}): UseQueryResult<Job[] | undefined> => {
  const connectedWallet = useConnectedWallet();
  const contractAddress = useContractAddress('warp-controller');
  const enabled = opts.enabled ?? true;

  const query = useQuery(
    [QUERY_KEY.JOBS, connectedWallet?.network, contractAddress, JSON.stringify(opts)],
    async ({ queryKey }) => {
      if (!connectedWallet) {
        return [];
      }

      const jobs = await fetchJobs(queryKey[1] as NetworkInfo, queryKey[2] as CW20Addr, opts);

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
