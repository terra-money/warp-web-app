import { useContractAddress } from '@terra-money/apps/hooks';
import { CW20Addr } from '@terra-money/apps/types';
import { NetworkInfo, useConnectedWallet } from '@terra-money/wallet-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { warp_controller } from 'types';
import jsonpath from 'jsonpath';
import { QUERY_KEY } from './queryKey';
import { contractQuery } from '@terra-money/apps/queries';

// TODO: remove this / temporary workaround
const composeMsgFromTemplate = (template: warp_controller.Template, vars: TmpTemplateVar[]): string => {
  let json = JSON.parse(template.msg);

  vars.forEach((v) => {
    try {
      // TODO: add paths
      jsonpath.value(json, v.path, `$warp.variable.${v.name}`);
    } catch (err) {
      // consume the error
    }
  });

  return JSON.stringify(json, null, 2);
};

type TmpTemplateVar = {
  name: string;
  kind: warp_controller.VariableKind;
  path: string;
  default_value: string;
};

const fetchTemplates = async (
  network: NetworkInfo,
  contractAddress: CW20Addr,
  opts: warp_controller.QueryTemplatesMsg
): Promise<warp_controller.Template[]> => {
  const response = await contractQuery<
    Extract<warp_controller.QueryMsg, { query_templates: {} }>,
    warp_controller.TemplatesResponse
  >(network, contractAddress, { query_templates: opts }, { templates: [] });

  const resp = response.templates.map((t) => {
    let newTemplate = { ...t };

    newTemplate.vars = newTemplate.vars.map((v) => {
      let newVar = v as any as TmpTemplateVar;
      let pathSplits = newVar.path.split('.');
      newVar.name = pathSplits[pathSplits.length - 1];
      newVar.default_value = '';
      return newVar;
    }) as any;

    newTemplate.msg = composeMsgFromTemplate(newTemplate, newTemplate.vars as any as TmpTemplateVar[]);

    newTemplate.vars = newTemplate.vars.map((v) => ({ static: v } as any));

    return newTemplate;
  });

  return resp;
};

type TemplatesQueryOpts = warp_controller.QueryTemplatesMsg & {
  enabled?: boolean;
};

export const useTemplatesQuery = (
  opts: TemplatesQueryOpts = {}
): UseQueryResult<warp_controller.Template[] | undefined> => {
  const connectedWallet = useConnectedWallet();
  const contractAddress = useContractAddress('warp-controller');
  const enabled = opts.enabled ?? true;

  const query = useQuery(
    [QUERY_KEY.TEMPLATES, connectedWallet?.network, contractAddress, JSON.stringify(opts)],
    async ({ queryKey }) => {
      if (!connectedWallet) {
        return [];
      }

      const templates = await fetchTemplates(queryKey[1] as NetworkInfo, queryKey[2] as CW20Addr, opts);

      return templates;
    },
    {
      refetchOnMount: false,
      keepPreviousData: false,
      enabled,
    }
  );

  return query as UseQueryResult<warp_controller.Template[] | undefined>;
};
