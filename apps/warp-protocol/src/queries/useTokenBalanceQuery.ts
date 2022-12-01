import { fetchTokenBalance } from '@terra-money/apps/queries';
import { Token, u } from '@terra-money/apps/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useQuery, UseQueryResult } from 'react-query';
import Big from 'big.js';
import { QUERY_KEY } from './queryKey';

export const useTokenBalanceQuery = (walletAddress: string, token: Token): UseQueryResult<u<Big> | undefined> => {
  const connectedWallet = useConnectedWallet();

  const query = useQuery(
    [QUERY_KEY.BALANCE, connectedWallet?.network, token, walletAddress],
    async ({ queryKey }) => {
      if (!connectedWallet || !walletAddress) {
        return undefined;
      }

      const balance = await fetchTokenBalance(connectedWallet.network, token, walletAddress);

      return balance;
    },
    {
      refetchOnMount: true,
      initialData: undefined,
    }
  );

  return query as UseQueryResult<u<Big> | undefined>;
};
