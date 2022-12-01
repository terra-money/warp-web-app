import { useQuery, UseQueryResult } from 'react-query';
import { contractQuery } from '@terra-money/apps/queries';
import { useAssertConnectedWallet, useContractAddress } from '@terra-money/apps/hooks';
import { QUERY_KEY } from './queryKey';
import { warp_controller } from 'types';
import { base64encode, encodeQuery } from '../utils';
import { useMemo } from 'react';

export function useSimulateQuery(queryJson: string): UseQueryResult<object | undefined> {
  const connectedWallet = useAssertConnectedWallet();
  const contractAddress = useContractAddress('warp-controller');

  const key = useMemo(() => {
    return base64encode(queryJson ?? '');
  }, [queryJson]);

  return useQuery(
    [QUERY_KEY.SIMULATE_QUERY, contractAddress, connectedWallet.network.name, key],
    async () => {
      let query = undefined;

      try {
        query = encodeQuery(queryJson);
      } catch (e) {}

      if (!query) {
        return undefined;
      }

      const resp = await contractQuery<
        Extract<warp_controller.QueryMsg, { simulate_query: {} }>,
        warp_controller.SimulateResponse
      >(connectedWallet.network, contractAddress, { simulate_query: { query } });

      return JSON.parse(resp.response);
    },
    {
      keepPreviousData: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
}
