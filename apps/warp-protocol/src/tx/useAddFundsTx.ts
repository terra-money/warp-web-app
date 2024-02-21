import { useTx } from '@terra-money/apps/libs/transactions';
import { TX_KEY } from './txKey';
import { Token } from '@terra-money/apps/types';
import Big from 'big.js';
import { u } from '@terra-money/apps/types';
import { useWarpSdk } from '@terra-money/apps/hooks';

interface AddFundsTxProps {
  token: Token;
  amount: u<Big>;
}

export const useAddFundsTx = (fundingAccountAddress: string) => {
  const sdk = useWarpSdk();

  return useTx<AddFundsTxProps>(
    async (options) => {
      const { token, amount, wallet } = options;

      return sdk.tx.depositToAccount(wallet.walletAddress, fundingAccountAddress, token, amount.toString());
    },
    {
      txKey: TX_KEY.ADD_FUNDS,
    }
  );
};
