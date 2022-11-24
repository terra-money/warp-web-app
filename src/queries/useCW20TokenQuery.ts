import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { NetworkInfo, useWallet } from '@terra-money/wallet-provider';
import { QUERY_KEY } from './queryKey';
import { LCDClient } from '@terra-money/terra.js/dist/client';
import { CW20Addr } from 'shared/types';

interface CW20TokenResponse {
  tokenAddr: CW20Addr;
  decimals: number;
  name: string;
  symbol: string;
}

export const fetchCW20Token = async (
  networkOrLCD: NetworkInfo | LCDClient,
  tokenAddr: CW20Addr
): Promise<CW20TokenResponse> => {
  const lcd =
    networkOrLCD instanceof LCDClient
      ? networkOrLCD
      : new LCDClient({
          URL: networkOrLCD.lcd,
          chainID: networkOrLCD.chainID,
        });

  const response = await lcd.wasm.contractQuery<CW20TokenResponse>(tokenAddr, {
    token_info: {},
  });

  return { ...response, tokenAddr };
};

const isCW20TokenAddr = (tokenAddr: CW20Addr) => {
  return tokenAddr.length === 64 && tokenAddr?.startsWith('terra');
};

export const useCW20TokenQuery = (
  tokenAddr: CW20Addr | undefined,
  options: Partial<Pick<UseQueryOptions, 'enabled'>> = { enabled: true }
): UseQueryResult<CW20TokenResponse> => {
  const { network } = useWallet();

  return useQuery(
    [QUERY_KEY.CW20_TOKEN, network, tokenAddr],
    ({ queryKey }) => {
      if (tokenAddr && isCW20TokenAddr(tokenAddr)) {
        return fetchCW20Token(queryKey[1] as NetworkInfo, tokenAddr);
      }
      return undefined;
    },
    {
      keepPreviousData: false,
      refetchOnMount: false,
      ...options,
    }
  );
};
