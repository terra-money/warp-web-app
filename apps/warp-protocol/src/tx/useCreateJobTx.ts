import { useTx } from '@terra-money/apps/libs/transactions';
import { u } from '@terra-money/apps/types';
import Big from 'big.js';
import { TX_KEY } from './txKey';
import { containsAllReferencedVarsInCosmosMsg } from 'utils/msgs';
import { useWarpSdk } from '@terra-money/apps/hooks';
import { warp_resolver } from '@terra-money/warp-sdk';

export interface CreateJobTxProps {
  name: string;
  reward: u<Big>;
  description: string;
  msgs: warp_resolver.CosmosMsgFor_Empty[];
  vars: warp_resolver.Variable[];
  condition: warp_resolver.Condition;
}

export const useCreateJobTx = () => {
  const sdk = useWarpSdk();

  return useTx<CreateJobTxProps>(
    async (options) => {
      const { wallet, reward, name, msgs, condition, vars, description } = options;

      if (!containsAllReferencedVarsInCosmosMsg(vars, msgs, condition)) {
        throw Error(
          'Unexpected error occurred - unknown variable found in create job transaction payload. Refreshing the page and recreating the job should mitigate the issue.'
        );
      }

      return sdk.tx.createJob(wallet.walletAddress, {
        recurring: false,
        requeue_on_evict: true,
        name,
        labels: [],
        description,
        condition: JSON.stringify(condition),
        vars: JSON.stringify(vars),
        reward: reward.toString(),
        msgs: JSON.stringify(msgs),
      });
    },
    {
      txKey: TX_KEY.CREATE_JOB,
    }
  );
};
