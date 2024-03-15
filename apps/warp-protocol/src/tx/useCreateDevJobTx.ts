import { useTx } from '@terra-money/apps/libs/transactions';
import { useWarpSdk } from '@terra-money/apps/hooks';
import { TX_KEY } from './txKey';
import { warp_controller } from '@terra-money/warp-sdk';
import { Token, u } from '@terra-money/apps/types';
import { Coin, Coins } from '@terra-money/feather.js';
import Big from 'big.js';

export type CreateDevJobTxProps = {
  createJobMsg: warp_controller.CreateJobMsg;
  token?: Token;
  amount?: u<Big>;
};

export const useCreateDevJobTx = () => {
  const sdk = useWarpSdk();

  return useTx<CreateDevJobTxProps>(
    async (options) => {
      const { wallet, createJobMsg, token, amount } = options;

      let coins = new Coins();

      if (token && amount) {
        if (token.type === 'cw20') {
          createJobMsg.cw_funds = [
            {
              cw20: {
                contract_addr: token.token,
                amount: amount.toString(),
              },
            },
          ];
        } else {
          coins = coins.add(new Coin(token.denom, amount.toString()));
        }
      }

      const nativeTokenDenom = await sdk.nativeTokenDenom();

      // If funding account is not provided, add operational amount to Coins
      if (!createJobMsg.funding_account) {
        coins = coins.add(new Coin(nativeTokenDenom, createJobMsg.operational_amount));
      }

      return sdk.tx.createJob(wallet.walletAddress, createJobMsg, coins);
    },
    {
      txKey: TX_KEY.CREATE_JOB,
    }
  );
};
