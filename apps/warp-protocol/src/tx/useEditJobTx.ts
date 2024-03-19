import { useTx } from '@terra-money/apps/libs/transactions';
import { useWarpSdk } from '@terra-money/apps/hooks';
import { TX_KEY } from './txKey';

interface EditJobTx {
  name?: string;
  description?: string;
  jobId: string;
}

export const useEditJobTx = () => {
  const sdk = useWarpSdk();

  return useTx<EditJobTx>(
    async (options) => {
      const { wallet, jobId, name, description } = options;

      return sdk.tx.updateJob(wallet.walletAddress, {
        id: jobId,
        name,
        description,
      });
    },
    {
      txKey: TX_KEY.EDIT_JOB,
    }
  );
};
