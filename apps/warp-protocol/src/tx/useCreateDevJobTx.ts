import { useTx } from '@terra-money/apps/libs/transactions';
import { useWarpSdk } from '@terra-money/apps/hooks';
import { TX_KEY } from './txKey';
import { warp_controller } from '@terra-money/warp-sdk';

export type CreateDevJobTxProps = warp_controller.CreateJobMsg;

export const useCreateDevJobTx = () => {
  const sdk = useWarpSdk();

  return useTx<CreateDevJobTxProps>(
    async (options) => {
      const { wallet, ...rest } = options;

      return sdk.tx.createJob(wallet.walletAddress, {
        ...rest,
      });
    },
    {
      txKey: TX_KEY.CREATE_JOB,
    }
  );
};
