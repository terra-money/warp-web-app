import { useQuery, UseQueryResult } from 'react-query';
import { useLocalWallet } from '../../hooks';
import { IBCTokensResponse } from '../../types';
import { fixTokenResponse } from '../index';
import { QUERY_KEY } from '../queryKey';

interface IBCTokensNetworkResponse {
  [network: string]: IBCTokensResponse;
}

const fetchIBCTokens = async (network: string): Promise<IBCTokensResponse> => {
  const response = await fetch('https://assets.terra.dev/ibc/tokens.json');

  const tokens: IBCTokensNetworkResponse = await response.json();

  return tokens && tokens[network] ? fixTokenResponse('ibc', tokens[network], (key) => `ibc/${key}`) : {};
};

export const useIBCTokensQuery = (): UseQueryResult<IBCTokensResponse> => {
  const wallet = useLocalWallet();

  return useQuery(
    [QUERY_KEY.IBC_TOKENS, wallet.chainId],
    () => {
      if (wallet.chain.name === 'neutron') {
        return {
          'ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9': {
            path: 'transfer/channel-0',
            base_denom: 'uatom',
            key: 'ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9',
            type: 'ibc',
            denom: 'ibc/C4CFF46FD6DE35CA4CF4CE031E643C8FDC9BA4B99AE598E9B0ED98FE3A2319F9',
            name: 'Cosmos',
            symbol: 'ATOM',
            decimals: 6,
            icon: 'https://assets.terra.dev/icon/svg/ibc/ATOM.svg',
            coinGeckoId: 'cosmos',
          },
        } as IBCTokensResponse;
      }

      if (wallet.chain.name !== 'terra') {
        return {};
      }

      return fetchIBCTokens(wallet.connectedWallet?.network ?? 'mainnet');
    },
    {
      refetchOnMount: false,
    }
  );
};
