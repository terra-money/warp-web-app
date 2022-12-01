import { useTx, TxBuilder } from '@terra-money/apps/libs/transactions';
import { TX_KEY } from './txKey';
import { Token, warp_controller } from 'types';
import Big from 'big.js';
import { u } from '@terra-money/apps/types';
import { TransferMsg } from 'types/tx';
import { useWarpAccount } from 'queries/useWarpAccount';

interface AddFundsTxProps {
  token: Token;
  amount: u<Big>;
}

export const useAddFundsTx = () => {
  const { data: account = {} as warp_controller.Account } = useWarpAccount();

  return useTx<AddFundsTxProps>(
    (options) => {
      const { token, amount } = options;

      if (token.type === 'cw20') {
        return TxBuilder.new()
          .execute<TransferMsg>(account.owner, token.token, {
            transfer: {
              amount: amount.toString(),
              recipient: account.account,
            },
          })
          .build();
      }

      return TxBuilder.new()
        .send(account.owner, account.account, {
          [token.denom]: amount.toString(),
        })
        .build();
    },
    {
      txKey: TX_KEY.ADD_FUNDS,
    }
  );
};
