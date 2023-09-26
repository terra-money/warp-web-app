import { useQuery, UseQueryResult } from 'react-query';
import { useChainSelector } from '../../hooks';
import { INJ, LUNA, NativeTokensResponse, NEUTRON, NIBIRU } from '../../types';

export const useNativeTokensQuery = (
  queryName: string = 'QUERY:NATIVE_TOKENS'
): UseQueryResult<NativeTokensResponse> => {
  const { selectedChain } = useChainSelector();

  return useQuery(
    [queryName],
    () => {
      return {
        ...(selectedChain.name === 'terra' && { [LUNA.key]: LUNA }),
        ...(selectedChain.name === 'injective' && { [INJ.key]: INJ }),
        ...(selectedChain.name === 'neutron' && { [NEUTRON.key]: NEUTRON }),
        ...(selectedChain.name === 'nibiru' && { [NIBIRU.key]: NIBIRU }),
      };
    },
    {
      refetchOnMount: false,
    }
  );
};
