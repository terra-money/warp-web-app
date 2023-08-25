import { useTx } from '@terra-money/apps/libs/transactions';
import { TX_KEY } from './txKey';
import { Token } from '@terra-money/apps/types';
import Big from 'big.js';
import { u } from '@terra-money/apps/types';
import { useWarpAccount } from 'queries/useWarpAccount';
import { useWarpSdk } from '@terra-money/apps/hooks';
import { warp_controller } from '@terra-money/warp-sdk';

interface AddFundsTxProps {
  token: Token;
  amount: u<Big>;
}

export const useAddFundsTx = () => {
  const { data: account = {} as warp_controller.Account } = useWarpAccount();
  const sdk = useWarpSdk();

  return useTx<AddFundsTxProps>(
    async (options) => {
      const { token, amount } = options;

      return sdk.tx.depositToAccount(account.owner, account.account, token, amount.toString());
    },
    {
      txKey: TX_KEY.ADD_FUNDS,
    }
  );
};
