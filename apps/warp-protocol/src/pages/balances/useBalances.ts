import { useChainSelector, useChainSuffix } from '@terra-money/apps/hooks';
import { useNativeToken } from 'hooks/useNativeToken';
import { useCallback, useMemo } from 'react';
import { Token } from '@terra-money/apps/types';
import { useLocalStorage } from 'usehooks-ts';

type BalancesStorage = {
  [key: string]: Token[];
};

const storageKey = (chainId: string, walletAddress: string) => `${chainId}--${walletAddress}`;

export const useBalances = (walletAddress: string) => {
  const { selectedChainId } = useChainSelector();
  const nativeToken = useNativeToken();

  const defaultTokens = useMemo(() => [nativeToken], [nativeToken]);

  const storedBalancesKey = useChainSuffix('__warp_stored_funding_account_balances');
  const [storedBalances, setStoredBalances] = useLocalStorage<BalancesStorage>(storedBalancesKey, {});

  const setBalances = useCallback(
    (tokens: Token[]) => {
      setStoredBalances((storedBalances) => {
        return {
          ...storedBalances,
          [storageKey(selectedChainId, walletAddress)]: tokens,
        };
      });
    },
    [walletAddress, setStoredBalances, selectedChainId]
  );

  const balances = useMemo(() => {
    return storedBalances[storageKey(selectedChainId, walletAddress)] ?? defaultTokens;
  }, [storedBalances, walletAddress, selectedChainId, defaultTokens]);

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
