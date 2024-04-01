import { useChainSelector } from '@terra-money/apps/hooks';
import {
  ARCHWAY,
  ARCHWAY_TESTNET,
  INJ,
  LUNA,
  NativeToken,
  NEUTRON,
  NIBIRU,
  ORAICHAIN,
  OSMO,
  WHALE,
} from '@terra-money/apps/types';
import { useMemo } from 'react';

export const useNativeToken = (): NativeToken => {
  const { selectedChain, selectedChainId } = useChainSelector();

  return useMemo(() => {
    if (selectedChain.name === 'archway' && selectedChainId === 'constantine-3') {
      return ARCHWAY_TESTNET;
    }

    switch (selectedChain.name) {
      case 'terra':
        return LUNA;
      case 'injective':
        return INJ;
      case 'neutron':
        return NEUTRON;
      case 'nibiru':
        return NIBIRU;
      case 'migaloo':
        return WHALE;
      case 'osmosis':
        return OSMO;
      case 'archway':
        return ARCHWAY;
      case 'oraichain':
        return ORAICHAIN;
    }
  }, [selectedChain.name, selectedChainId]);
};
