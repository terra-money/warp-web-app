import { useCallback } from 'react';
import { warp_resolver } from '@terra-money/warp-sdk';
import { useExternalVariableDisplayDialog } from './external/ExternalVariableDisplayDialog';
import { useQueryVariableDisplayDialog } from './query/QueryVariableDisplayDialog';
import { useStaticVariableDisplayDialog } from './static/StaticVariableDisplayDialog';

export const useVariableDisplayDialog = () => {
  const openStaticVariableDisplayDialog = useStaticVariableDisplayDialog();
  const openQueryVariableDisplayDialog = useQueryVariableDisplayDialog();
  const openExternalVariableDisplayDialog = useExternalVariableDisplayDialog();

  return useCallback(
    async (v: warp_resolver.Variable, variables: warp_resolver.Variable[]): Promise<void | undefined> => {
      if ('static' in v) {
        return openStaticVariableDisplayDialog({ variable: v.static, variables });
      }

      if ('query' in v) {
        return openQueryVariableDisplayDialog({ variable: v.query, variables });
      }

      if ('external' in v) {
        return openExternalVariableDisplayDialog({ variable: v.external, variables });
      }

      return undefined;
    },
    [openExternalVariableDisplayDialog, openQueryVariableDisplayDialog, openStaticVariableDisplayDialog]
  );
};
