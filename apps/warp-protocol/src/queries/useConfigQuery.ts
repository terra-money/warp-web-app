import { useContractAddress } from '@terra-money/apps/hooks';
import { CW20Addr } from '@terra-money/apps/types';
import { NetworkInfo, useConnectedWallet } from '@terra-money/wallet-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { warp_controller, warp_resolver } from 'types';
import { QUERY_KEY } from './queryKey';
import { contractQuery } from '@terra-money/apps/queries';

const fetchWarpControllerConfig = async (
  network: NetworkInfo,
  contractAddress: CW20Addr
): Promise<warp_controller.Config> => {
  const response = await contractQuery<
    Extract<warp_controller.QueryMsg, { query_config: {} }>,
    warp_controller.ConfigResponse
  >(network, contractAddress, { query_config: {} });

  return response.config;
};

const fetchWarpResolverConfig = async (
  network: NetworkInfo,
  contractAddress: CW20Addr
): Promise<warp_resolver.Config> => {
  const response = await contractQuery<
    Extract<warp_resolver.QueryMsg, { query_config: {} }>,
    warp_resolver.ConfigResponse
  >(network, contractAddress, { query_config: {} });

  return response.config;
};

export const useWarpConfig = (): UseQueryResult<(warp_controller.Config & warp_resolver.Config) | undefined> => {
  const connectedWallet = useConnectedWallet();
  const controllerAddress = useContractAddress('warp-controller');
  const resolverAddress = useContractAddress('warp-resolver');

  const query = useQuery(
    [QUERY_KEY.WARP_CONFIG, connectedWallet?.network, controllerAddress, resolverAddress],
    async ({ queryKey }) => {
      if (!connectedWallet) {
        return undefined;
      }

      const controllerConfig = await fetchWarpControllerConfig(queryKey[1] as NetworkInfo, queryKey[2] as CW20Addr);
      const resolverConfig = await fetchWarpResolverConfig(queryKey[1] as NetworkInfo, queryKey[3] as CW20Addr);

      return {
        ...controllerConfig,
        template_fee: resolverConfig.template_fee,
      };
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  return query as UseQueryResult<(warp_controller.Config & warp_resolver.Config) | undefined>;
};
