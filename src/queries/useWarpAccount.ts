import { useContractAddress } from 'shared/hooks';
import { CW20Addr } from 'shared/types';
import { NetworkInfo, useConnectedWallet } from '@terra-money/wallet-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { warp_controller } from 'types';
import { QUERY_KEY } from './queryKey';
import { contractQuery } from 'shared/queries';

const fetchWarpAccount = async (
  network: NetworkInfo,
  contractAddress: CW20Addr,
  walletAddress: string
): Promise<warp_controller.Account> => {
  const response = await contractQuery<
    Extract<warp_controller.QueryMsg, { query_account: {} }>,
    warp_controller.AccountResponse
  >(network, contractAddress, { query_account: { owner: walletAddress } }, { account: undefined } as any);

  return response.account;
};

export const useWarpAccount = (): UseQueryResult<warp_controller.Account | undefined> => {
  const connectedWallet = useConnectedWallet();
  const contractAddress = useContractAddress('warp-controller');

  const query = useQuery(
    [QUERY_KEY.WARP_ACCOUNT, connectedWallet?.network, contractAddress, connectedWallet?.walletAddress],
    async ({ queryKey }) => {
      if (!connectedWallet) {
        return undefined;
      }

      const account = await fetchWarpAccount(
        queryKey[1] as NetworkInfo,
        queryKey[2] as CW20Addr,
        queryKey[3] as string
      );

      return account;
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  return query as UseQueryResult<warp_controller.Account | undefined>;
};
