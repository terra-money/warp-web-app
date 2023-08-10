import { useTx } from '@terra-money/apps/libs/transactions';
import { TX_KEY } from './txKey';
import { useWarpSdk } from '@terra-money/apps/hooks';

interface CancelJobTxProps {
  jobId: string;
}

export const useCancelJobTx = () => {
  const sdk = useWarpSdk();

  return useTx<CancelJobTxProps>(
    async (options) => {
      const { wallet, jobId } = options;

      return sdk.tx.deleteJob(wallet.walletAddress, jobId);
    },
    {
      txKey: TX_KEY.CANCEL_JOB,
    }
  );
};
