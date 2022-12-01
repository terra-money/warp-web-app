import { useQuery } from 'react-query';
import { QUERY_KEY } from './queryKey';
import { useApiEndpoint } from 'hooks';
import { Frequency } from 'utils';

export type AnalyticsTypeName =
  | 'create_job_count'
  | 'execute_job_count'
  | 'update_job_count'
  | 'delete_job_count'
  | 'prioritize_job_count'
  | 'reward_amount';

type Response = Array<{ timestamp: number; value: string }>;

export const useAnalyticsQuery = (type: AnalyticsTypeName, limit: number = 7, frequency: Frequency = 'daily') => {
  const endpoint = useApiEndpoint({
    path: 'v1/analytics',
    params: {
      frequency,
      limit,
      direction: 'desc',
      type,
    },
  });

  return useQuery(
    [QUERY_KEY.ANALYTICS, endpoint],
    async ({ queryKey }) => {
      const response = await fetch(queryKey[1]);

      const json: Response = await response.json();

      return json.map(({ timestamp, value }) => {
        return {
          timestamp,
          value,
        };
      });
    },
    {
      refetchOnMount: false,
    }
  );
};
