import { useContractAddress } from '@terra-money/apps/hooks';
import { useTx, TxBuilder } from '@terra-money/apps/libs/transactions';
import { warp_controller } from '../types/contracts';
import { TX_KEY } from './txKey';

export type CreateDevJobTxProps = warp_controller.CreateJobMsg;

type CreateDevJobMsg = Extract<warp_controller.ExecuteMsg, { create_job: {} }>;

export const useCreateDevJobTx = () => {
  const contractAddress = useContractAddress('warp-controller');

  return useTx<CreateDevJobTxProps>(
    (options) => {
      const { wallet, ...rest } = options;

      let txBuilder = TxBuilder.new();

      return txBuilder
        .execute<CreateDevJobMsg>(wallet.walletAddress, contractAddress, {
          create_job: {
            ...rest,
          },
        })
        .build();
    },
    {
      txKey: TX_KEY.CREATE_JOB,
    }
  );
};
