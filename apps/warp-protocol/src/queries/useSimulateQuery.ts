import { useQuery, UseQueryResult } from 'react-query';
import { useLocalWallet } from '@terra-money/apps/hooks';
import { QUERY_KEY } from './queryKey';
import { base64encode, parseQuery } from '../utils';
import { useMemo } from 'react';
import { useWarpSdk } from '@terra-money/apps/hooks';

export function useSimulateQuery(queryJson: string): UseQueryResult<object | undefined> {
  const localWallet = useLocalWallet();
  const sdk = useWarpSdk();

  const key = useMemo(() => {
    return base64encode(queryJson ?? '');
  }, [queryJson]);

  return useQuery(
    [QUERY_KEY.SIMULATE_QUERY, localWallet.chainId, key],
    async () => {
      let query = undefined;

      try {
        query = parseQuery(queryJson);
      } catch (e) {}

      if (!query) {
        return undefined;
      }

      return sdk.simulateQuery(query);
    },
    {
      keepPreviousData: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
}
