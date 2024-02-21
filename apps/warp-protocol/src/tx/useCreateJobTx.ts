import { useTx } from '@terra-money/apps/libs/transactions';
import { TX_KEY } from './txKey';
import { containsAllReferencedVars, orderVarsByReferencing } from 'utils/msgs';
import { useWarpSdk } from '@terra-money/apps/hooks';
import { composers, warp_resolver } from '@terra-money/warp-sdk';
import { Coin } from '@terra-money/feather.js';

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

      return sdk.tx.createJob(wallet.walletAddress, createJobMsg, [new Coin(nativeTokenDenom, operationalAmount)]);
    },
    {
      txKey: TX_KEY.CREATE_JOB,
    }
  );
};
