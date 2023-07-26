import { useLocalWallet } from '@terra-money/apps/hooks';
import { useQuery, UseQueryResult } from 'react-query';
import { warp_resolver } from 'types';
import { QUERY_KEY } from './queryKey';
import { useWarpSdk } from '@terra-money/apps/hooks';

type TemplatesQueryOpts = warp_resolver.QueryTemplatesMsg & {
  enabled?: boolean;
};

export const useTemplatesQuery = (
  opts: TemplatesQueryOpts = {}
): UseQueryResult<warp_resolver.Template[] | undefined> => {
  const enabled = opts.enabled ?? true;
  const wallet = useLocalWallet();
  const sdk = useWarpSdk();

  const query = useQuery(
    [QUERY_KEY.TEMPLATES, wallet.chainId, JSON.stringify(opts)],
    async () => {
      const templates = await sdk.templates(opts);

      return templates;
    },
    {
      refetchOnMount: false,
      keepPreviousData: false,
      enabled,
    }
  );

  return query as UseQueryResult<warp_resolver.Template[] | undefined>;
};
