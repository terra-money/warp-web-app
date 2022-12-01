import { useContractAddress } from '@terra-money/apps/hooks';
import { CW20Token } from 'types';

export const useWarpToken = (): CW20Token => {
  const contractAddress = useContractAddress('warp-token');

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
