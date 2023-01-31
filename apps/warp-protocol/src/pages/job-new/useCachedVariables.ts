import { useConnectedWallet } from '@terra-money/wallet-provider';
import { Variable } from 'pages/variables/useVariableStorage';
import { useCallback, useMemo } from 'react';
import { variableName } from 'utils/variable';
import { useLocalStorage } from 'usehooks-ts';

export const useCachedVariables = () => {
  const connectedWallet = useConnectedWallet();

  const initialValue = useMemo(() => [], []);
  const [cachedVariables, setCachedVariables] = useLocalStorage<Variable[]>(`__warp_cached_variables`, initialValue);

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

  const updateVariable = useCallback(
    (variable: Variable, prev: Variable) => {
      const variableExists = Boolean(variables.find((v) => variableName(v) === variableName(prev)));
      let updatedVariables: Variable[] = [...variables];

      if (variableExists) {
        const newVariables = [...variables];
        newVariables[variables.findIndex((v) => variableName(v) === variableName(prev))] = variable;
        updatedVariables = newVariables;
      }

      setVariables(updatedVariables);
    },
    [setVariables, variables]
  );

  const saveVariable = useCallback(
    (variable: Variable) => {
      const variableExists = Boolean(variables.find((v) => variableName(v) === variableName(variable)));
      let updatedVariables: Variable[] = [];

      if (!variableExists) {
        updatedVariables = [...variables, variable];
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
      updateVariable,
      setVariables,
      saveAll,
      clearAll,
    }),
    [variables, saveVariable, removeVariable, saveAll, clearAll, updateVariable, setVariables]
  );
};
