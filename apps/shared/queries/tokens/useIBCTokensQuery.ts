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
      return fetchIBCTokens(wallet.connectedWallet?.network ?? 'mainnet');
    },
    {
      refetchOnMount: false,
    }
  );
};
