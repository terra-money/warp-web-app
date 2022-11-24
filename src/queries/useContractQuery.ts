import { CW20Addr } from 'shared/types';
import { useQuery } from 'react-query';
import { contractQuery } from 'shared/queries';
import { useAssertConnectedWallet } from 'shared/hooks';
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
