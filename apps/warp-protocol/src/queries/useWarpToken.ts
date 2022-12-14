import { useContractAddress } from '@terra-money/apps/hooks';
import { CW20Token } from 'types';

export const useWarpToken = (): CW20Token => {
  // TODO: add token address
  const contractAddress = useContractAddress('warp-controller');

  return {
    protocol: 'Warp',
    name: 'Warp token',
    symbol: 'WARP',
    decimals: 6,
    type: 'cw20',
    token: contractAddress,
    key: contractAddress,
    icon: 'https://assets.terra.money/icon/svg/CW.svg',
  };
};
