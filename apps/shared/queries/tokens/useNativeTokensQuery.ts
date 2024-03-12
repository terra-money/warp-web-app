import { useQuery, UseQueryResult } from 'react-query';
import { useChainSelector } from '../../hooks';
import { INJ, LUNA, NativeTokensResponse, NEUTRON, NIBIRU, WHALE, OSMO } from '../../types';

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
        ...(selectedChain.name === 'migaloo' && { [WHALE.key]: WHALE }),
        ...(selectedChain.name === 'osmosis' && { [OSMO.key]: OSMO }),
      };
    },
    {
      refetchOnMount: false,
    }
  );
};
