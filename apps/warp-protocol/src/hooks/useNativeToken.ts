import { useChainSelector } from '@terra-money/apps/hooks';
import { INJ, LUNA } from '@terra-money/apps/types';
import { useMemo } from 'react';

export const useNativeToken = () => {
  const { selectedChain } = useChainSelector();

  return useMemo(() => {
    switch (selectedChain.name) {
      case 'terra':
        return LUNA;
      case 'injective':
        return INJ;
    }
  }, [selectedChain.name]);
};
