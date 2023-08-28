import { useTx } from '@terra-money/apps/libs/transactions';
import { u } from '@terra-money/apps/types';
import Big from 'big.js';
import { useWarpSdk } from '@terra-money/apps/hooks';
import { TX_KEY } from './txKey';
import { warp_resolver } from '@terra-money/warp-sdk';

interface EditJobTx {
  name?: string;
  reward?: u<Big>;
  jobId: string;
  condition?: warp_resolver.Condition;
}

export const useEditJobTx = () => {
  const sdk = useWarpSdk();

  return useTx<EditJobTx>(
    async (options) => {
      const { wallet, jobId, name, reward } = options;

      return sdk.tx.updateJob(wallet.walletAddress, {
        id: jobId,
        name,
        ...(reward && { added_reward: reward.toString() }),
      });
    },
    {
      txKey: TX_KEY.EDIT_JOB,
    }
  );
};
