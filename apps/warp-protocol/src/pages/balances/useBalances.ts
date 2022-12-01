import { ConnectedWallet, useConnectedWallet } from '@terra-money/wallet-provider';
import { useCallback, useMemo } from 'react';
import { LUNA, Token } from 'types';
import { useLocalStorage } from 'usehooks-ts';

type BalancesStorage = {
  [key: string]: Token[];
};

const storageKey = (connectedWallet: ConnectedWallet) =>
  `${connectedWallet.network.name}--${connectedWallet.walletAddress}`;

export const useBalances = () => {
  const connectedWallet = useConnectedWallet();

  const defaultTokens = useMemo(() => [LUNA], []);

  const [storedBalances, setStoredBalances] = useLocalStorage<BalancesStorage>('__warp_stored_balances', {});

  const setBalances = useCallback(
    (tokens: Token[]) => {
      if (!connectedWallet) {
        return;
      }

      setStoredBalances((storedBalances) => {
        return {
          ...storedBalances,
          [storageKey(connectedWallet)]: tokens,
        };
      });
    },
    [connectedWallet, setStoredBalances]
  );

  const balances = useMemo(() => {
    if (!connectedWallet) {
      return [];
    }

    return storedBalances[storageKey(connectedWallet)] ?? defaultTokens;
  }, [storedBalances, connectedWallet, defaultTokens]);

  const saveAll = useCallback(
    (tokens: Token[]) => {
      setBalances(tokens);
    },
    [setBalances]
  );

  const saveBalance = useCallback(
    (token: Token) => {
      const balanceExists = Boolean(balances.find((b) => b.key === token.key));

      if (!balanceExists) {
        return setBalances([...balances, token]);
      }
    },
    [setBalances, balances]
  );

  const removeBalance = useCallback(
    (token: Token) => {
      return setBalances(balances.filter((b) => b.key !== token.key));
    },
    [setBalances, balances]
  );

  return useMemo(
    () => ({
      balances,
      saveBalance,
      removeBalance,
      saveAll,
    }),
    [balances, saveBalance, removeBalance, saveAll]
  );
};
