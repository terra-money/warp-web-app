import { useLocalWallet } from '@terra-money/apps/hooks';
import { useCallback, useMemo } from 'react';
import { variableName } from 'utils/variable';
import { useLocalStorage } from 'usehooks-ts';
import { warp_controller } from 'types';

export const useCachedVariables = () => {
  const localWallet = useLocalWallet();

  const initialValue = useMemo(() => [], []);
  const [cachedVariables, setCachedVariables] = useLocalStorage<warp_controller.Variable[]>(
    `__warp_cached_variables`,
    initialValue
  );

  const setVariables = useCallback(
    (variables: warp_controller.Variable[]) => {
      if (!localWallet.connectedWallet) {
        return;
      }

      setCachedVariables(variables);
    },
    [localWallet, setCachedVariables]
  );

  const variables = useMemo(() => {
    if (!localWallet.connectedWallet) {
      return [];
    }

    return cachedVariables ?? [];
  }, [cachedVariables, localWallet]);

  const saveAll = useCallback(
    (variables: warp_controller.Variable[]) => {
      setVariables(variables);
    },
    [setVariables]
  );

  const clearAll = useCallback(() => {
    setVariables([]);
  }, [setVariables]);

  const updateVariable = useCallback(
    (variable: warp_controller.Variable, prev: warp_controller.Variable) => {
      const variableExists = Boolean(variables.find((v) => variableName(v) === variableName(prev)));
      let updatedVariables: warp_controller.Variable[] = [...variables];

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
    (variable: warp_controller.Variable) => {
      const variableExists = Boolean(variables.find((v) => variableName(v) === variableName(variable)));
      let updatedVariables: warp_controller.Variable[] = [...variables];

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
