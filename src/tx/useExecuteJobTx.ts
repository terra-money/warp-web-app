import { useContractAddress } from 'shared/hooks';
import { useTx, TxBuilder } from 'shared/libs/transactions';
import { TX_KEY } from './txKey';
import { warp_controller } from '../types/contracts';
import { useWarpAccount } from 'queries/useWarpAccount';
import { useEffect, useRef } from 'react';

interface ExecuteJobTxProps {
  jobId: string;
}

type ExecuteMsgType = Extract<warp_controller.ExecuteMsg, { execute_job: {} }>;

export const useExecuteJobTx = () => {
  const contractAddress = useContractAddress('warp-controller');
  const { data: account } = useWarpAccount();

  const accountRef = useRef<warp_controller.Account | undefined>();

  useEffect(() => {
    accountRef.current = account;
  }, [account]);

  return useTx<ExecuteJobTxProps>(
    (options) => {
      const { wallet, jobId } = options;

      let txBuilder = TxBuilder.new();

      return txBuilder
        .execute<ExecuteMsgType>(wallet.walletAddress, contractAddress, {
          execute_job: {
            id: jobId,
          },
        })
        .build();
    },
    {
      txKey: TX_KEY.EXECUTE_JOB,
    }
  );
};
