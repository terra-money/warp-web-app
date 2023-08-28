import { useCallback, useMemo, useState } from 'react';
import { Token } from '@terra-money/apps/types';

export const useSelectedTokens = (tokens: Token[]) => {
  const [selectedTokens, setSelectedTokens] = useState<Token[]>(tokens);

  const saveSelectedToken = useCallback(
    (token: Token) => {
      setSelectedTokens((bs) => {
        const selectedTokenExists = Boolean(bs.find((b) => b.key === token.key));

        if (!selectedTokenExists) {
          return [...bs, token];
        }

        return bs;
      });
    },
    [setSelectedTokens]
  );

  const removeSelectedToken = useCallback(
    (token: Token) => {
      setSelectedTokens((bs) => {
        return bs.filter((b) => b.key !== token.key);
      });
    },
    [setSelectedTokens]
  );

  return useMemo(
    () => ({
      selectedTokens,
      saveSelectedToken,
      removeSelectedToken,
    }),
    [selectedTokens, saveSelectedToken, removeSelectedToken]
  );
};
