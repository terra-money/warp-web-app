import { LocalWallet, useLocalWallet } from '@terra-money/apps/hooks';
import { useCallback, useMemo } from 'react';
import { LUNA, Token } from 'types';
import { useLocalStorage } from 'usehooks-ts';

type BalancesStorage = {
  [key: string]: Token[];
};

const storageKey = (connectedWallet: LocalWallet) => `${connectedWallet.chainId}--${connectedWallet.walletAddress}`;

export const useBalances = () => {
  const localWallet = useLocalWallet();

  const defaultTokens = useMemo(() => [LUNA], []);

  const [storedBalances, setStoredBalances] = useLocalStorage<BalancesStorage>('__warp_stored_balances', {});

  const setBalances = useCallback(
    (tokens: Token[]) => {
      if (!localWallet.connectedWallet) {
        return;
      }

      setStoredBalances((storedBalances) => {
        return {
          ...storedBalances,
          [storageKey(localWallet)]: tokens,
        };
      });
    },
    [localWallet, setStoredBalances]
  );

  const balances = useMemo(() => {
    if (!localWallet.connectedWallet) {
      return [];
    }

    return storedBalances[storageKey(localWallet)] ?? defaultTokens;
  }, [storedBalances, localWallet, defaultTokens]);

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
