import { useTx } from '@terra-money/apps/libs/transactions';
import { TX_KEY } from './txKey';
import { containsAllReferencedVars, orderVarsByReferencing } from 'utils/msgs';
import { useWarpSdk } from '@terra-money/apps/hooks';
import { Token, composers, warp_resolver } from '@terra-money/warp-sdk';
import { Coin, Coins } from '@terra-money/feather.js';
import Big from 'big.js';
import { u } from '@terra-money/apps/types';

export interface CreateJobTxProps {
  name: string;
  description: string;
  msgs: warp_resolver.WarpMsg[];
  vars: warp_resolver.Variable[];
  durationDays: string;
  condition: warp_resolver.Condition;
  operationalAmount: string;
  reward: string;
  recurring: boolean;
  fundingAccount?: string;
  token?: Token;
  amount?: u<Big>;
}

export const useCreateJobTx = () => {
  const sdk = useWarpSdk();

  return useTx<CreateJobTxProps>(
    async (options) => {
      const {
        wallet,
        name,
        msgs,
        condition,
        vars,
        description,
        recurring,
        durationDays,
        operationalAmount,
        reward,
        fundingAccount,
        token,
        amount,
      } = options;

      if (!containsAllReferencedVars(vars, msgs, condition)) {
        throw Error(
          'Unexpected error occurred - unknown variable found in create job transaction payload. Refreshing the page and recreating the job should mitigate the issue.'
        );
      }

      const orderedVars = orderVarsByReferencing(vars);
      const executions = [{ condition, msgs }];

      const nativeTokenDenom = await sdk.nativeTokenDenom();

      const createJobMsg = composers.job
        .create()
        .name(name)
        .labels([])
        .reward(reward.toString())
        .operationalAmount(operationalAmount.toString())
        .recurring(recurring)
        .description(description)
        .vars(orderedVars)
        .fundingAccount(fundingAccount)
        .durationDays(durationDays)
        .executions(executions)
        .compose();

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
