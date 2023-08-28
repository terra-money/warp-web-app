import { CW20Addr } from '@terra-money/warp-sdk';
import { useWarpSdk } from '@terra-money/apps/hooks';
import { CW20Token } from '@terra-money/apps/types';

export const useWarpToken = (): CW20Token => {
  const sdk = useWarpSdk();
  // TODO: add token address
  const contractAddress = sdk.chain.contracts.controller;

  return {
    protocol: 'Warp',
    name: 'Warp token',
    symbol: 'WARP',
    decimals: 6,
    type: 'cw20',
    token: contractAddress as CW20Addr,
    key: contractAddress,
    icon: 'https://assets.terra.dev/icon/svg/CW.svg',
  };
};
