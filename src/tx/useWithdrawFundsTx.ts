import { useTx, TxBuilder } from 'shared/libs/transactions';
import { TX_KEY } from './txKey';
import { Token, warp_account, warp_controller } from 'types';
import Big from 'big.js';
import { u } from 'shared/types';
import { useWarpAccount } from 'queries/useWarpAccount';

interface WithdrawFundsTxProps {
  token: Token;
  amount: u<Big>;
}

type ExecuteMsg = warp_account.ExecuteMsg;

export const useWithdrawFundsTx = () => {
  const { data: account = {} as warp_controller.Account } = useWarpAccount();

  return useTx<WithdrawFundsTxProps>(
    (options) => {
      const { token, amount, wallet } = options;

      if (token.type === 'cw20') {
        const transferMsg = {
          transfer: {
            amount: amount.toString(),
            recipient: account.owner,
          },
        };

        return TxBuilder.new()
          .execute<ExecuteMsg>(wallet.walletAddress, account.account, {
            msgs: [
              {
                wasm: {
                  execute: {
                    contract_addr: token.token,
                    msg: Buffer.from(JSON.stringify(transferMsg)).toString('base64'),
                    funds: [],
                  },
                },
              },
            ],
          })
          .build();
      }

      return TxBuilder.new()
        .execute<ExecuteMsg>(wallet.walletAddress, account.account, {
          msgs: [
            {
              bank: {
                send: {
                  amount: [{ denom: token.denom, amount: amount.toString() }],
                  to_address: wallet.walletAddress,
                },
              },
            },
          ],
        })
        .build();
    },
    {
      txKey: TX_KEY.WITHDRAW_FUNDS,
    }
  );
};
