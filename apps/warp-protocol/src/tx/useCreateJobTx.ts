import { useTx } from '@terra-money/apps/libs/transactions';
import { TX_KEY } from './txKey';
import { containsAllReferencedVars, orderVarsByReferencing } from 'utils/msgs';
import { useWarpSdk } from '@terra-money/apps/hooks';
import { composers, warp_resolver } from '@terra-money/warp-sdk';

export interface CreateJobTxProps {
  name: string;
  description: string;
  msgs: warp_resolver.WarpMsg[];
  vars: warp_resolver.Variable[];
  condition: warp_resolver.Condition;
  recurring: boolean;
}

export const useCreateJobTx = () => {
  const sdk = useWarpSdk();

  return useTx<CreateJobTxProps>(
    async (options) => {
      const { wallet, name, msgs, condition, vars, description, recurring } = options;

      if (!containsAllReferencedVars(vars, msgs, condition)) {
        throw Error(
          'Unexpected error occurred - unknown variable found in create job transaction payload. Refreshing the page and recreating the job should mitigate the issue.'
        );
      }

      // TODO:
      // - add ui for depositing assets
      // - extend useCreateJobTx with deposits
      // - add estimate fee options + UI

      const orderedVars = orderVarsByReferencing(vars);
      const durationDays = '30';
      const executions = [{ condition, msgs }];

      const estimateJobRewardMsg = composers.job
        .estimate()
        .recurring(recurring)
        .durationDays(durationDays)
        .vars(orderedVars)
        .executions(executions)
        .compose();

      const reward = await sdk.estimateJobReward(wallet.walletAddress, estimateJobRewardMsg);

      const operationalAmount = await sdk.estimateJobFee(
        wallet.walletAddress,
        estimateJobRewardMsg,
        reward.amount.toString()
      );

      const createJobMsg = composers.job
        .create()
        .name(name)
        .reward(reward.amount.toString())
        .operationalAmount(operationalAmount.amount.toString())
        .recurring(recurring)
        .description(description)
        .labels([])
        .vars(orderedVars)
        .durationDays(durationDays)
        .executions(executions)
        .compose();

      return sdk.tx.createJob(wallet.walletAddress, createJobMsg, [
        operationalAmount,
        // TODO: add deposits
      ]);
    },
    {
      txKey: TX_KEY.CREATE_JOB,
    }
  );
};
