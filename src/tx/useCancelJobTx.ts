import { useContractAddress } from 'shared/hooks';
import { useTx, TxBuilder } from 'shared/libs/transactions';
import { TX_KEY } from './txKey';
import { warp_controller } from 'types/contracts';

interface CancelJobTxProps {
  jobId: string;
}

type ExecuteMsgType = Extract<warp_controller.ExecuteMsg, { delete_job: {} }>;

export const useCancelJobTx = () => {
  const contractAddress = useContractAddress('warp-controller');

  return useTx<CancelJobTxProps>(
    (options) => {
      const { wallet, jobId } = options;

      return TxBuilder.new()
        .execute<ExecuteMsgType>(wallet.walletAddress, contractAddress, {
          delete_job: {
            id: jobId,
          },
        })
        .build();
    },
    {
      txKey: TX_KEY.CANCEL_JOB,
    }
  );
};
