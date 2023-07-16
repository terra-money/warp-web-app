import { useQuery, UseQueryResult } from 'react-query';
import { QUERY_KEY } from 'queries';
import { LCDClientConfig } from '@terra-money/feather.js';
import { useLocalWallet } from '@terra-money/apps/hooks';

export const fetchBlockHeight = async (info: LCDClientConfig): Promise<number> => {
  const response = await fetch(`${info.lcd}/blocks/latest`);

  const json = await response.json();

  return +json.block.header.height;
};

export const useBlockHeightQuery = (): UseQueryResult<number> => {
  const wallet = useLocalWallet();

  return useQuery(
    [QUERY_KEY.BLOCK_HEIGHT, wallet.chainId],
    () => {
      if (!wallet) {
        return undefined;
      }

      return fetchBlockHeight(wallet.lcdClientConfig);
    },
    {
      keepPreviousData: false,
      refetchOnMount: false,
    }
  );
};
