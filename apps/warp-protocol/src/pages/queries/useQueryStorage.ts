import { ConnectedWallet, useConnectedWallet } from '@terra-money/wallet-provider';
import { TemplateWithVarValues } from 'forms/QueryExprForm';
import { useCallback, useMemo } from 'react';
import { warp_controller } from 'types';
import { useLocalStorage } from 'usehooks-ts';

export type Query = warp_controller.QueryExpr & {
  template?: TemplateWithVarValues;
};

type QueriesStorage = {
  [key: string]: Query[];
};

const storageKey = (connectedWallet: ConnectedWallet) =>
  `${connectedWallet.network.name}--${connectedWallet.walletAddress}`;

export const useQueryStorage = () => {
  const connectedWallet = useConnectedWallet();

  const [storedQueries, setStoredQueries] = useLocalStorage<QueriesStorage>('__warp_stored_queries', {});

  const setQueries = useCallback(
    (queries: Query[]) => {
      if (!connectedWallet) {
        return;
      }

      setStoredQueries((storedQueries) => {
        return {
          ...storedQueries,
          [storageKey(connectedWallet)]: queries,
        };
      });
    },
    [connectedWallet, setStoredQueries]
  );

  const queries = useMemo(() => {
    if (!connectedWallet) {
      return [];
    }

    return storedQueries[storageKey(connectedWallet)] ?? [];
  }, [storedQueries, connectedWallet]);

  const saveAll = useCallback(
    (queries: Query[]) => {
      setQueries(queries);
    },
    [setQueries]
  );

  const saveQuery = useCallback(
    (query: Query) => {
      const queryExists = Boolean(queries.find((q) => q.name === query.name));

      if (!queryExists) {
        return setQueries([...queries, query]);
      } else {
        const newQueries = [...queries];
        newQueries[queries.findIndex((q) => q.name === query.name)] = query;
        return setQueries(newQueries);
      }
    },
    [setQueries, queries]
  );

  const removeQuery = useCallback(
    (query: Query) => {
      return setQueries(queries.filter((q) => q.name !== query.name));
    },
    [setQueries, queries]
  );

  return useMemo(
    () => ({
      queries,
      saveQuery,
      removeQuery,
      saveAll,
    }),
    [queries, saveQuery, removeQuery, saveAll]
  );
};
