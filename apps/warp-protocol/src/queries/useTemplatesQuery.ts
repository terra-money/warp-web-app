import { useContractAddress } from '@terra-money/apps/hooks';
import { CW20Addr } from '@terra-money/apps/types';
import { NetworkInfo, useWallet } from '@terra-money/wallet-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { warp_resolver } from 'types';
import { QUERY_KEY } from './queryKey';
import { contractQuery } from '@terra-money/apps/queries';

const fetchTemplates = async (
  network: NetworkInfo,
  contractAddress: CW20Addr,
  opts: warp_resolver.QueryTemplatesMsg
): Promise<warp_resolver.Template[]> => {
  const resp = await contractQuery<
    Extract<warp_resolver.QueryMsg, { query_templates: {} }>,
    warp_resolver.TemplatesResponse
  >(network, contractAddress, { query_templates: opts }, { templates: [] });

  return resp.templates;
};

type TemplatesQueryOpts = warp_resolver.QueryTemplatesMsg & {
  enabled?: boolean;
};

export const useTemplatesQuery = (
  opts: TemplatesQueryOpts = {}
): UseQueryResult<warp_resolver.Template[] | undefined> => {
  const wallet = useWallet();
  const contractAddress = useContractAddress('warp-controller');
  const enabled = opts.enabled ?? true;

  const query = useQuery(
    [QUERY_KEY.TEMPLATES, wallet.network, contractAddress, JSON.stringify(opts)],
    async ({ queryKey }) => {
      const templates = await fetchTemplates(queryKey[1] as NetworkInfo, queryKey[2] as CW20Addr, opts);

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
