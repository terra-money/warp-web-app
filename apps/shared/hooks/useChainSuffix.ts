import { useMemo } from 'react';
import { useChainSelector } from './useChainSelector';

export const useChainSuffix = (name: string) => {
  const { selectedChain } = useChainSelector();

  return useMemo(() => `${name}--${selectedChain.name}`, [name, selectedChain.name]);
};
