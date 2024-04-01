import { useQuery, UseQueryResult } from 'react-query';
import { useChainSelector } from '../../hooks';
import { INJ, LUNA, NativeTokensResponse, NEUTRON, NIBIRU, WHALE, OSMO, ARCHWAY, ARCHWAY_TESTNET, ORAICHAIN } from '../../types';

export const useNativeTokensQuery = (
  queryName: string = 'QUERY:NATIVE_TOKENS'
): UseQueryResult<NativeTokensResponse> => {
  const { selectedChain, selectedChainId } = useChainSelector();

  return useQuery(
    [queryName],
    () => {
      let archwayTokens = {};

      if (selectedChain.name === 'archway') {
        if (selectedChainId === 'constantine-3') {
          archwayTokens = {
            [ARCHWAY_TESTNET.key]: ARCHWAY_TESTNET,
          };
        } else {
          archwayTokens = {
            [ARCHWAY.key]: ARCHWAY,
          };
        }
      }

      return {
        ...(selectedChain.name === 'terra' && { [LUNA.key]: LUNA }),
        ...(selectedChain.name === 'injective' && { [INJ.key]: INJ }),
        ...(selectedChain.name === 'neutron' && { [NEUTRON.key]: NEUTRON }),
        ...(selectedChain.name === 'nibiru' && { [NIBIRU.key]: NIBIRU }),
        ...(selectedChain.name === 'migaloo' && { [WHALE.key]: WHALE }),
        ...(selectedChain.name === 'osmosis' && { [OSMO.key]: OSMO }),
        ...(selectedChain.name === 'oraichain' && { [ORAICHAIN.key]: ORAICHAIN }),
        ...archwayTokens,
      };
    },
    {
      refetchOnMount: false,
    }
  );
};
