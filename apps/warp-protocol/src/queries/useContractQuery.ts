import { CW20Addr } from '@terra-money/apps/types';
import { useQuery } from 'react-query';
import { contractQuery } from '@terra-money/apps/queries';
import { useAssertConnectedWallet } from '@terra-money/apps/hooks';
import { QUERY_KEY } from './queryKey';

export function useContractQuery(contract: CW20Addr, message: {}) {
  const connectedWallet = useAssertConnectedWallet();

  return useQuery(
    [QUERY_KEY.CONTRACT, contract, message],
    async () => {
      return await contractQuery(connectedWallet.network, contract, message);
    },
    {
      enabled: Boolean(contract) && Boolean(message),
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
}
