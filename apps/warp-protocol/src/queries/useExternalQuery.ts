import { useQuery, UseQueryResult } from 'react-query';
import { useAssertConnectedWallet, useContractAddress } from '@terra-money/apps/hooks';
import { QUERY_KEY } from './queryKey';
import { base64encode } from '../utils';
import { useMemo } from 'react';

export function useExternalQuery(url: string, method: string, body?: string): UseQueryResult<object | undefined> {
  const connectedWallet = useAssertConnectedWallet();
  const contractAddress = useContractAddress('warp-controller');

  const key = useMemo(() => {
    return base64encode(url + method + body ?? '');
  }, [body, method, url]);

  return useQuery(
    [QUERY_KEY.EXTERNAL_QUERY, contractAddress, connectedWallet.network.name, key],
    async () => {
      const resp = await fetch(url, {
        method: method.toUpperCase(),
        body,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return resp.json();
    },
    {
      keepPreviousData: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
}
