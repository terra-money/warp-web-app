import { useLocalWallet } from '@terra-money/apps/hooks';
import { useQuery, UseQueryResult } from 'react-query';
import { QUERY_KEY } from './queryKey';
import { useWarpSdk } from '@terra-money/apps/hooks';
import { warp_controller, warp_templates } from '@terra-money/warp-sdk';

export const useWarpConfig = (): UseQueryResult<(warp_controller.Config & warp_templates.Config) | undefined> => {
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

  return query as UseQueryResult<(warp_controller.Config & warp_templates.Config) | undefined>;
};
