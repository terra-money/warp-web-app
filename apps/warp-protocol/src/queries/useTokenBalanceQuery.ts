import { fetchTokenBalance } from '@terra-money/apps/queries';
import { Token, u } from '@terra-money/apps/types';
import { useLocalWallet } from '@terra-money/apps/hooks';
import { useQuery, UseQueryResult } from 'react-query';
import Big from 'big.js';
import { QUERY_KEY } from './queryKey';

export const useTokenBalanceQuery = (walletAddress: string, token: Token): UseQueryResult<u<Big> | undefined> => {
  const localWallet = useLocalWallet();

  const query = useQuery(
    [QUERY_KEY.BALANCE, localWallet.chainId, token.key, walletAddress],
    async ({ queryKey }) => {
      if (!localWallet.connectedWallet || !walletAddress) {
        return undefined;
      }

      const balance = await fetchTokenBalance(localWallet.lcd, token, walletAddress);

      return balance;
    },
    {
      refetchOnMount: true,
      initialData: undefined,
    }
  );

  return query as UseQueryResult<u<Big> | undefined>;
};
