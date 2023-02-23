import { useContractAddress } from '@terra-money/apps/hooks';
import { CW20Addr } from '@terra-money/apps/types';
import { NetworkInfo, useWallet } from '@terra-money/wallet-provider';
import { QueryClient, useQuery, useQueryClient, UseQueryResult } from 'react-query';
import { warp_controller } from 'types';
import { QUERY_KEY } from './queryKey';
import { contractQuery } from '@terra-money/apps/queries';
import { Job } from 'types/job';

const fetchJob = async (
  network: NetworkInfo,
  contractAddress: CW20Addr,
  jobId: string
): Promise<warp_controller.Job> => {
  const response = await contractQuery<
    Extract<warp_controller.QueryMsg, { query_job: {} }>,
    warp_controller.JobResponse
  >(network, contractAddress, { query_job: { id: jobId } });

  return response.job;
};

const findJob = (queryClient: QueryClient, queryKey: string, jobId: string) =>
  queryClient
    .getQueriesData<Job[]>(queryKey)
    .flatMap(([_, streams]) => streams)
    .filter((d) => Boolean(d))
    .find((d) => d.info.id === jobId);

export const readJobFromCache = (jobId: string | undefined, queryClient: QueryClient) => {
  if (!jobId) {
    return undefined;
  }

  return findJob(queryClient, QUERY_KEY.JOBS, jobId);
};

export const useJobQuery = (jobId?: string): UseQueryResult<Job | undefined> => {
  const wallet = useWallet();
  const contractAddress = useContractAddress('warp-controller');
  const queryClient = useQueryClient();

  const query = useQuery(
    [QUERY_KEY.JOB, wallet.network, contractAddress, jobId],
    async ({ queryKey }) => {
      if (!jobId) {
        return undefined;
      }

      const job = await fetchJob(queryKey[1] as NetworkInfo, queryKey[2] as CW20Addr, queryKey[3] as string);

      return new Job(job);
    },
    {
      refetchOnMount: true,
      initialData: readJobFromCache(jobId, queryClient),
    }
  );

  return query as UseQueryResult<Job | undefined>;
};
