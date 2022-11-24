import { useContractAddress } from 'shared/hooks';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { QUERY_KEY } from './queryKey';

type WarpAPRResult = {
  apr: number;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type Token = 'WARP' | 'WARP-ASTRO-LP';

// TODO implement useTokenAPRQuery
export const useTokenAPRQuery = (token: Token): UseQueryResult<WarpAPRResult | undefined> => {
  const connectedWallet = useConnectedWallet();
  const contractAddress = useContractAddress('warp-controller');

  const query = useQuery(
    [QUERY_KEY.APR, connectedWallet?.network, contractAddress, token],
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
