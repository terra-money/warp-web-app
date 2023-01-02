import { useEffectOnceWhen } from '@terra-money/apps/hooks';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useVariableStorage } from 'pages/variables/useVariableStorage';
import { useCallback, useMemo, useState } from 'react';
import { isEmpty } from 'lodash';
import { warp_controller } from 'types/contracts/warp_controller';
import { variableName } from 'utils/variable';

export type Variable =
  | warp_controller.Variable
  | {
      query: QueryVariable;
    };

export type QueryVariable = warp_controller.QueryVariable & {
  template?: warp_controller.Template;
  default_value: warp_controller.QueryExpr;
};

export const useCachedVariables = () => {
  const connectedWallet = useConnectedWallet();

  const { variables: storageVars } = useVariableStorage();
  const [cachedVariables, setCachedVariables] = useState<Variable[]>(storageVars);

  useEffectOnceWhen(
    () => setCachedVariables(storageVars),
    () => !isEmpty(storageVars)
  );

  const setVariables = useCallback(
    (variables: Variable[]) => {
      if (!connectedWallet) {
        return;
      }

      setCachedVariables(variables);
    },
    [connectedWallet, setCachedVariables]
  );

  const variables = useMemo(() => {
    if (!connectedWallet) {
      return [];
    }

    return cachedVariables ?? [];
  }, [cachedVariables, connectedWallet]);

  const saveAll = useCallback(
    (variables: Variable[]) => {
      setVariables(variables);
    },
    [setVariables]
  );

  const saveVariable = useCallback(
    (variable: Variable, prev?: Variable) => {
      const variableExists = Boolean(variables.find((v) => variableName(v) === variableName(variable)));
      let updatedVariables = [];

      console.log({ variable });

      if (!variableExists) {
        updatedVariables = [...variables, variable];
      } else {
        const newVariables = [...variables];
        newVariables[variables.findIndex((v) => variableName(v) === variableName(variable))] = variable;
        updatedVariables = newVariables;
      }

      if (prev && variableName(variable) !== variableName(prev)) {
        updatedVariables = updatedVariables.filter((v) => variableName(v) !== variableName(prev));
      }

      console.log({ updatedVariables });

      setVariables(updatedVariables);
    },
    [setVariables, variables]
  );

  const removeVariable = useCallback(
    (name: string) => {
      return setVariables(variables.filter((v) => variableName(v) !== name));
    },
    [setVariables, variables]
  );

  return useMemo(
    () => ({
      variables,
      saveVariable,
      removeVariable,
      saveAll,
    }),
    [variables, saveVariable, removeVariable, saveAll]
  );
};
