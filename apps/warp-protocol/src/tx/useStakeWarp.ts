import { useContractAddress } from '@terra-money/apps/hooks';
import { useTx, TxBuilder } from '@terra-money/apps/libs/transactions';
import { TX_KEY } from './txKey';
import { warp_controller } from 'types/contracts';

interface StakeWarpTxProps {
  amount: string;
}

type ExecuteMsgType = Extract<warp_controller.ExecuteMsg, { stake: {} }>;

export const useStakeWarp = () => {
  const contractAddress = useContractAddress('warp-controller');

  return useTx<StakeWarpTxProps>(
    (options) => {
      const { wallet } = options;

      return (
        TxBuilder.new()
          // @ts-ignore
          .execute<ExecuteMsgType>(wallet.walletAddress, contractAddress, {
            stake: {},
          })
          .build()
      );
    },
    {
      txKey: TX_KEY.EXECUTE_JOB,
    }
  );
};
