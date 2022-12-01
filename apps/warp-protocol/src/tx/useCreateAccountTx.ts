import { useContractAddress } from '@terra-money/apps/hooks';
import { useTx, TxBuilder } from '@terra-money/apps/libs/transactions';
import { warp_controller } from '../types/contracts';
import { TX_KEY } from './txKey';

export interface CreateAccountTxProps {}

type CreateAccountMsg = Extract<warp_controller.ExecuteMsg, { create_account: {} }>;

export const useCreateAccountTx = () => {
  const contractAddress = useContractAddress('warp-controller');

  return useTx<CreateAccountTxProps>(
    (options) => {
      const { wallet } = options;

      return TxBuilder.new()
        .execute<CreateAccountMsg>(wallet.walletAddress, contractAddress, {
          create_account: {},
        })
        .build();
    },
    {
      txKey: TX_KEY.CREATE_ACCOUNT,
    }
  );
};
