import { useTx } from '@terra-money/apps/libs/transactions';
import { TX_KEY } from './txKey';
import { useWarpSdk } from '@terra-money/apps/hooks';

interface ExecuteJobTxProps {
  jobId: string;
}

export const useExecuteJobTx = () => {
  const sdk = useWarpSdk();

  return useTx<ExecuteJobTxProps>(
    async (options) => {
      const { wallet, jobId } = options;

      return sdk.tx.executeJob(wallet.walletAddress, jobId);
    },
    {
      txKey: TX_KEY.EXECUTE_JOB,
    }
  );
};
