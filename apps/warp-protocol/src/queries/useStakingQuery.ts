import { useLocalWallet } from '@terra-money/apps/hooks';
import { useQuery, UseQueryResult } from 'react-query';
import { QUERY_KEY } from './queryKey';

type StakingQueryOpts = {
  token: string;
};

// TODO UPDATE THESE TO ACTUAL VALUES
type StakingQueryResult = {
  totalTokens: number;
  amountStaked: number;
  amountStakedByWallet: number;
  percentageStaked: number;
};

export const useStakingQuery = (opts: StakingQueryOpts): UseQueryResult<StakingQueryResult | undefined> => {
  const { connectedWallet, chainId } = useLocalWallet();

  const query = useQuery(
    [QUERY_KEY.STAKING, chainId, JSON.stringify(opts)],
    async ({ queryKey }) => {
      if (!connectedWallet) {
        return [];
      }

      return {
        totalTokens: 1509202454,
        amountStaked: 1230000,
        amountStakedByWallet: 10000,
        percentageStaked: 0.0815,
      };
    },
    {
      refetchOnMount: false,
    }
  );

  return query as UseQueryResult<StakingQueryResult | undefined>;
};
