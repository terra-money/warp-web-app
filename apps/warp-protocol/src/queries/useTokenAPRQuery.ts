import { useLocalWallet } from '@terra-money/apps/hooks';
import { useQuery, UseQueryResult } from 'react-query';
import { QUERY_KEY } from './queryKey';

type WarpAPRResult = {
  apr: number;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type Token = 'WARP' | 'WARP-ASTRO-LP';

// TODO implement useTokenAPRQuery
export const useTokenAPRQuery = (token: Token): UseQueryResult<WarpAPRResult | undefined> => {
  const { connectedWallet } = useLocalWallet();

  const query = useQuery(
    [QUERY_KEY.APR, connectedWallet?.network, token],
    async ({ queryKey }) => {
      await sleep(500);

      return { apr: 0.13 };
    },
    {
      refetchOnMount: true,
      initialData: undefined,
    }
  );

  return query as UseQueryResult<WarpAPRResult | undefined>;
};
