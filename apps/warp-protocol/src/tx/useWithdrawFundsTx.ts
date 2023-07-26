import { useTx } from '@terra-money/apps/libs/transactions';
import { TX_KEY } from './txKey';
import { Token } from 'types';
import Big from 'big.js';
import { u } from '@terra-money/apps/types';
import { useWarpSdk } from '@terra-money/apps/hooks';

interface WithdrawFundsTxProps {
  token: Token;
  amount: u<Big>;
}

export const useWithdrawFundsTx = () => {
  const sdk = useWarpSdk();

  return useTx<WithdrawFundsTxProps>(
    async (options) => {
      const { token, amount, wallet } = options;

      return sdk.tx.withdrawFromAccount(wallet.walletAddress, wallet.walletAddress, token, amount.toString());
    },
    {
      txKey: TX_KEY.WITHDRAW_FUNDS,
    }
  );
};
