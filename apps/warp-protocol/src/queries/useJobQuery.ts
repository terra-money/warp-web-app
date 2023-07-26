import { useLocalWallet } from '@terra-money/apps/hooks';
import { QueryClient, useQuery, useQueryClient, UseQueryResult } from 'react-query';
import { QUERY_KEY } from './queryKey';
import { Job } from 'types/job';
import { useWarpSdk } from '@terra-money/apps/hooks';

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
  const queryClient = useQueryClient();
  const wallet = useLocalWallet();
  const sdk = useWarpSdk();

  const query = useQuery(
    [QUERY_KEY.JOB, wallet.chainId, jobId],
    async () => {
      if (!jobId) {
        return undefined;
      }

      const job = await sdk.job(jobId);

      return new Job(job);
    },
    {
      refetchOnMount: true,
      initialData: readJobFromCache(jobId, queryClient),
    }
  );

  return query as UseQueryResult<Job | undefined>;
};
