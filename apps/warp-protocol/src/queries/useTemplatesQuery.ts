import { useLocalWallet } from '@terra-money/apps/hooks';
import { useQuery, UseQueryResult } from 'react-query';
import { QUERY_KEY } from './queryKey';
import { useWarpSdk } from '@terra-money/apps/hooks';
import { warp_templates } from '@terra-money/warp-sdk';
import { Template } from 'types';

type TemplatesQueryOpts = warp_templates.QueryTemplatesMsg & {
  enabled?: boolean;
};

export const useTemplatesQuery = (opts: TemplatesQueryOpts = {}): UseQueryResult<Template[] | undefined> => {
  const enabled = opts.enabled ?? true;
  const wallet = useLocalWallet();
  const sdk = useWarpSdk();

  const query = useQuery(
    [QUERY_KEY.TEMPLATES, wallet.chainId, JSON.stringify(opts)],
    async () => {
      const templates = await sdk.templates(opts);

      return templates.map((t) => new Template(t));
    },
    {
      refetchOnMount: false,
      keepPreviousData: false,
      enabled,
    }
  );

  return query as UseQueryResult<Template[] | undefined>;
};
