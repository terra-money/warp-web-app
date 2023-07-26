import { useLocalWallet } from '@terra-money/apps/hooks';
import { useQuery, UseQueryResult } from 'react-query';
import { warp_controller, warp_resolver } from 'types';
import { QUERY_KEY } from './queryKey';
import { useWarpSdk } from '@terra-money/apps/hooks';

export const useWarpConfig = (): UseQueryResult<(warp_controller.Config & warp_resolver.Config) | undefined> => {
  const { connectedWallet, chainId } = useLocalWallet();
  const sdk = useWarpSdk();

  const query = useQuery(
    [QUERY_KEY.WARP_CONFIG, chainId],
    async () => {
      if (!connectedWallet) {
        return undefined;
      }

      return sdk.config();
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  return query as UseQueryResult<(warp_controller.Config & warp_resolver.Config) | undefined>;
};
