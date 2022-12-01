import { useContractAddress } from '@terra-money/apps/hooks';
import { CW20Addr } from '@terra-money/apps/types';
import { NetworkInfo, useConnectedWallet } from '@terra-money/wallet-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { warp_controller } from 'types';
import { QUERY_KEY } from './queryKey';
import { contractQuery } from '@terra-money/apps/queries';

const fetchWarpConfig = async (network: NetworkInfo, contractAddress: CW20Addr): Promise<warp_controller.Config> => {
  const response = await contractQuery<
    Extract<warp_controller.QueryMsg, { query_config: {} }>,
    warp_controller.ConfigResponse
  >(network, contractAddress, { query_config: {} });

  return response.config;
};

export const useWarpConfig = (): UseQueryResult<warp_controller.Config | undefined> => {
  const connectedWallet = useConnectedWallet();
  const contractAddress = useContractAddress('warp-controller');

  const query = useQuery(
    [QUERY_KEY.WARP_CONFIG, connectedWallet?.network, contractAddress],
    async ({ queryKey }) => {
      if (!connectedWallet) {
        return undefined;
      }

      const config = await fetchWarpConfig(queryKey[1] as NetworkInfo, queryKey[2] as CW20Addr);

      return config;
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  return query as UseQueryResult<warp_controller.Config | undefined>;
};
