import { LocalWallet, useChainSuffix, useLocalWallet } from '@terra-money/apps/hooks';
import { useNativeToken } from 'hooks/useNativeToken';
import { useCallback, useMemo } from 'react';
import { Token } from '@terra-money/apps/types';
import { useLocalStorage } from 'usehooks-ts';

type BalancesStorage = {
  [key: string]: Token[];
};

const storageKey = (connectedWallet: LocalWallet) => `${connectedWallet.chainId}--${connectedWallet.walletAddress}`;

export const useBalances = () => {
  const localWallet = useLocalWallet();
  const nativeToken = useNativeToken();

  const defaultTokens = useMemo(() => [nativeToken], [nativeToken]);

  const storedBalancesKey = useChainSuffix('__warp_stored_balances');
  const [storedBalances, setStoredBalances] = useLocalStorage<BalancesStorage>(storedBalancesKey, {});

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
