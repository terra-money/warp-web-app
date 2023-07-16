import { useQuery, UseQueryResult } from 'react-query';
import { CW20TokensResponse } from '../../types';
import { fixTokenResponse } from '../utils';
import { QUERY_KEY } from '../queryKey';
import { useLocalWallet } from '../../hooks';

interface CW20TokensNetworkResponse {
  [network: string]: CW20TokensResponse;
}

const fetchCW20Tokens = async (network: string): Promise<CW20TokensResponse> => {
  const response = await fetch('https://assets.terra.money/cw20/tokens.json');

  const tokens: CW20TokensNetworkResponse = await response.json();

  return tokens && tokens[network] ? fixTokenResponse('cw20', tokens[network]) : {};
};

export const useCW20TokensQuery = (): UseQueryResult<CW20TokensResponse> => {
  const wallet = useLocalWallet();

  return useQuery(
    [QUERY_KEY.CW20_TOKENS, wallet.chainId],
    () => {
      if (!wallet.connectedWallet) {
        return undefined;
      }

      return fetchCW20Tokens(wallet.connectedWallet.network!);
    },
    {
      refetchOnMount: false,
    }
  );
};
