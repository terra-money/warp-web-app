import { useCallback } from 'react';
import { warp_resolver } from '@terra-money/warp-sdk';
import { Job } from 'types/job';
import { useExternalVariableDisplayDialog } from './external/ExternalVariableDisplayDialog';
import { useQueryVariableDisplayDialog } from './query/QueryVariableDisplayDialog';
import { useStaticVariableDisplayDialog } from './static/StaticVariableDisplayDialog';

export const useVariableDisplayDialog = () => {
  const openStaticVariableDisplayDialog = useStaticVariableDisplayDialog();
  const openQueryVariableDisplayDialog = useQueryVariableDisplayDialog();
  const openExternalVariableDisplayDialog = useExternalVariableDisplayDialog();

  return useCallback(
    async (v: warp_resolver.Variable, job: Job): Promise<void | undefined> => {
      if ('static' in v) {
        return openStaticVariableDisplayDialog({ variable: v.static, job });
      }

      if ('query' in v) {
        return openQueryVariableDisplayDialog({ variable: v.query, job });
      }

      if ('external' in v) {
        return openExternalVariableDisplayDialog({ variable: v.external, job });
      }

      return undefined;
    },
    [openExternalVariableDisplayDialog, openQueryVariableDisplayDialog, openStaticVariableDisplayDialog]
  );
};
