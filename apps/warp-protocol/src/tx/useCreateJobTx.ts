import { useTx } from '@terra-money/apps/libs/transactions';
import { u } from '@terra-money/apps/types';
import Big from 'big.js';
import { TX_KEY } from './txKey';
import { containsAllReferencedVars, orderVarsByReferencing } from 'utils/msgs';
import { useWarpSdk } from '@terra-money/apps/hooks';
import { warp_resolver } from '@terra-money/warp-sdk';

export interface CreateJobTxProps {
  name: string;
  reward: u<Big>;
  description: string;
  msgs: warp_resolver.CosmosMsgFor_Empty[];
  vars: warp_resolver.Variable[];
  condition: warp_resolver.Condition;
  recurring: boolean;
}

export const useCreateJobTx = () => {
  const sdk = useWarpSdk();

  return useTx<CreateJobTxProps>(
    async (options) => {
      const { wallet, reward, name, msgs, condition, vars, description, recurring } = options;

      if (!containsAllReferencedVars(vars, msgs, condition)) {
        throw Error(
          'Unexpected error occurred - unknown variable found in create job transaction payload. Refreshing the page and recreating the job should mitigate the issue.'
        );
      }

      const orderedVars = orderVarsByReferencing(vars);

      const duration_days = '30';
      const executions = [{ condition: JSON.stringify(condition), msgs: JSON.stringify(msgs) }];
      const jobFeeEstimate = await sdk.estimateJobFee(wallet.walletAddress, {
        vars: JSON.stringify(orderedVars),
        recurring: recurring,
        executions,
        duration_days,
      });

      // TODO:
      // - add ui for depositing assets
      // - extend useCreateJobTx with deposits
      // - add estimate fee options + UI

      return sdk.tx.createJob(
        wallet.walletAddress,
        {
          recurring,
          name,
          labels: [],
          description,
          vars: JSON.stringify(orderedVars),
          // TODO: add reward estimate
          reward: reward.toString(),
          // TODO: add duration_days input field
          duration_days,
          executions,
        },
        [
          jobFeeEstimate,
          // TODO: add deposits
        ]
      );
    },
    {
      txKey: TX_KEY.CREATE_JOB,
    }
  );
};
