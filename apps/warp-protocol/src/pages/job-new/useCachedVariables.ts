import { useEffectOnceWhen } from '@terra-money/apps/hooks';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useVariableStorage, Variable } from 'pages/variables/useVariableStorage';
import { useCallback, useMemo } from 'react';
import { isEmpty } from 'lodash';
import { variableName } from 'utils/variable';
import { useLocalStorage } from 'usehooks-ts';

export const useCachedVariables = () => {
  const connectedWallet = useConnectedWallet();

  const { variables: storageVars } = useVariableStorage();
  const [cachedVariables, setCachedVariables] = useLocalStorage<Variable[]>('__warp_cached_variables', []);

  useEffectOnceWhen(
    () => setCachedVariables(storageVars),
    () => !isEmpty(storageVars) && isEmpty(cachedVariables)
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

  const clearAll = useCallback(() => {
    setVariables([]);
  }, [setVariables]);

  const saveVariable = useCallback(
    (variable: Variable, prev?: Variable) => {
      const variableExists = Boolean(variables.find((v) => variableName(v) === variableName(variable)));
      let updatedVariables = [];

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
      clearAll,
    }),
    [variables, saveVariable, removeVariable, saveAll, clearAll]
  );
};
