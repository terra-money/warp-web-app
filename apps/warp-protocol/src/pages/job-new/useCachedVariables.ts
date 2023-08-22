import { useLocalWallet } from '@terra-money/apps/hooks';
import { useCallback, useMemo } from 'react';
import { variableName } from 'utils/variable';
import { useLocalStorage } from 'usehooks-ts';
import { warp_resolver } from '@terra-money/warp-sdk';

export const useCachedVariables = () => {
  const localWallet = useLocalWallet();

  const initialValue = useMemo(() => [], []);
  const [cachedVariables, setCachedVariables] = useLocalStorage<warp_resolver.Variable[]>(
    `__warp_cached_variables`,
    initialValue
  );

  const setVariables = useCallback(
    (variables: warp_resolver.Variable[]) => {
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
    (variables: warp_resolver.Variable[]) => {
      setVariables(variables);
    },
    [setVariables]
  );

  const clearAll = useCallback(() => {
    setVariables([]);
  }, [setVariables]);

  const updateVariable = useCallback(
    (variable: warp_resolver.Variable, prev: warp_resolver.Variable) => {
      const variableExists = Boolean(variables.find((v) => variableName(v) === variableName(prev)));
      let updatedVariables: warp_resolver.Variable[] = [...variables];

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
    (variable: warp_resolver.Variable) => {
      const variableExists = Boolean(variables.find((v) => variableName(v) === variableName(variable)));
      let updatedVariables: warp_resolver.Variable[] = [...variables];

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
