import { useContractAddress } from '@terra-money/apps/hooks';
import { CW20Addr } from '@terra-money/apps/types';
import { NetworkInfo, useWallet } from '@terra-money/wallet-provider';
import { QueryClient, useQuery, useQueryClient, UseQueryResult } from 'react-query';
import { warp_controller } from 'types';
import { QUERY_KEY } from './queryKey';
import { contractQuery } from '@terra-money/apps/queries';

const fetchTemplate = async (
  network: NetworkInfo,
  contractAddress: CW20Addr,
  templateId: string
): Promise<warp_controller.Template> => {
  const response = await contractQuery<
    Extract<warp_controller.QueryMsg, { query_template: {} }>,
    warp_controller.TemplateResponse
  >(network, contractAddress, { query_template: { id: templateId } });

  return response.template;
};

const findTemplate = (queryClient: QueryClient, queryKey: string, templateId: string) =>
  queryClient
    .getQueriesData<warp_controller.Template[]>(queryKey)
    .flatMap(([_, streams]) => streams)
    .filter((d) => Boolean(d))
    .find((d) => d.id === templateId);

export const readTemplateFromCache = (templateId: string | undefined, queryClient: QueryClient) => {
  if (!templateId) {
    return undefined;
  }

  return findTemplate(queryClient, QUERY_KEY.TEMPLATES, templateId);
};

export const useTemplateQuery = (templateId?: string): UseQueryResult<warp_controller.Template | undefined> => {
  const wallet = useWallet();
  const contractAddress = useContractAddress('warp-controller');
  const queryClient = useQueryClient();

  const query = useQuery(
    [QUERY_KEY.TEMPLATE, wallet.network, contractAddress, templateId],
    async ({ queryKey }) => {
      if (!templateId) {
        return undefined;
      }

      const template = await fetchTemplate(queryKey[1] as NetworkInfo, queryKey[2] as CW20Addr, queryKey[3] as string);
      return template;
    },
    {
      refetchOnMount: true,
      initialData: readTemplateFromCache(templateId, queryClient),
    }
  );

  return query as UseQueryResult<warp_controller.Template | undefined>;
};
