import { useContractAddress } from 'shared/hooks';
import { useConnectedWallet } from '@terra-money/wallet-provider';
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
  const connectedWallet = useConnectedWallet();
  const contractAddress = useContractAddress('warp-controller');

  const query = useQuery(
    [QUERY_KEY.STAKING, connectedWallet?.network, contractAddress, JSON.stringify(opts)],
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
