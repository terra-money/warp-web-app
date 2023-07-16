import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';
import { QUERY_KEY } from './queryKey';
import { LCDClient } from '@terra-money/feather.js';
import { CW20Addr } from '@terra-money/apps/types';
import { useLocalWallet } from '@terra-money/apps/hooks';

interface CW20TokenResponse {
  tokenAddr: CW20Addr;
  decimals: number;
  name: string;
  symbol: string;
}

export const fetchCW20Token = async (lcd: LCDClient, tokenAddr: CW20Addr): Promise<CW20TokenResponse> => {
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
  const wallet = useLocalWallet();

  return useQuery(
    [QUERY_KEY.CW20_TOKEN, wallet.chainId, tokenAddr],
    ({ queryKey }) => {
      if (tokenAddr && isCW20TokenAddr(tokenAddr)) {
        return fetchCW20Token(wallet.lcd, tokenAddr);
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
