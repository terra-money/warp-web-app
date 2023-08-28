import { useLocalWallet } from '@terra-money/apps/hooks';
import { QueryClient, useQuery, useQueryClient, UseQueryResult } from 'react-query';
import { QUERY_KEY } from './queryKey';
import { useWarpSdk } from '@terra-money/apps/hooks';
import { warp_templates } from '@terra-money/warp-sdk';

const findTemplate = (queryClient: QueryClient, queryKey: string, templateId: string) =>
  queryClient
    .getQueriesData<warp_templates.Template[]>(queryKey)
    .flatMap(([_, streams]) => streams)
    .filter((d) => Boolean(d))
    .find((d) => d.id === templateId);

export const readTemplateFromCache = (templateId: string | undefined, queryClient: QueryClient) => {
  if (!templateId) {
    return undefined;
  }

  return findTemplate(queryClient, QUERY_KEY.TEMPLATES, templateId);
};

export const useTemplateQuery = (templateId?: string): UseQueryResult<warp_templates.Template | undefined> => {
  const queryClient = useQueryClient();
  const wallet = useLocalWallet();
  const sdk = useWarpSdk();

  const query = useQuery(
    [QUERY_KEY.TEMPLATE, wallet.chainId, templateId],
    async () => {
      if (!templateId) {
        return undefined;
      }

      const template = await sdk.template(templateId);
      return template;
    },
    {
      refetchOnMount: true,
      initialData: readTemplateFromCache(templateId, queryClient),
    }
  );

  return query as UseQueryResult<warp_templates.Template | undefined>;
};
