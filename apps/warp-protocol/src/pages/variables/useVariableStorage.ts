import { ConnectedWallet, useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback, useMemo } from 'react';
import { warp_controller } from 'types/contracts/warp_controller';
import { useLocalStorage } from 'usehooks-ts';
import { variableName } from 'utils/variable';

export type Variable =
  | warp_controller.Variable
  | {
      query: QueryVariable;
    };

export type QueryVariable = warp_controller.QueryVariable & {
  template?: warp_controller.Template;
  init_fn: warp_controller.QueryExpr;
};

type VariablesStorage = {
  [key: string]: Variable[];
};

const storageKey = (connectedWallet: ConnectedWallet) =>
  `${connectedWallet.network.name}--${connectedWallet.walletAddress}`;

export const useVariableStorage = () => {
  const connectedWallet = useConnectedWallet();

  const [storedVariables, setStoredVariables] = useLocalStorage<VariablesStorage>('__warp_stored_variables', {});

  const setVariables = useCallback(
    (variables: Variable[]) => {
      if (!connectedWallet) {
        return;
      }

      setStoredVariables((storedVariables) => {
        return {
          ...storedVariables,
          [storageKey(connectedWallet)]: variables,
        };
      });
    },
    [connectedWallet, setStoredVariables]
  );

  const variables = useMemo(() => {
    if (!connectedWallet) {
      return [];
    }

    return storedVariables[storageKey(connectedWallet)] ?? [];
  }, [storedVariables, connectedWallet]);

  const saveAll = useCallback(
    (variables: Variable[]) => {
      setVariables(variables);
    },
    [setVariables]
  );

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
      saveAll,
    }),
    [variables, saveVariable, removeVariable, saveAll, updateVariable]
  );
};
