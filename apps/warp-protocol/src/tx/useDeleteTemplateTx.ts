import { useContractAddress } from '@terra-money/apps/hooks';
import { useTx, TxBuilder } from '@terra-money/apps/libs/transactions';
import { warp_controller } from '../types/contracts';
import { TX_KEY } from './txKey';

export type DeleteTemplateTxProps = warp_controller.DeleteTemplateMsg;

type DeleteTemplateMsg = Extract<warp_controller.ExecuteMsg, { delete_template: {} }>;

export const useDeleteTemplateTx = () => {
  const contractAddress = useContractAddress('warp-controller');

  return useTx<DeleteTemplateTxProps>(
    (options) => {
      const { wallet, id } = options;

      return TxBuilder.new()
        .execute<DeleteTemplateMsg>(wallet.walletAddress, contractAddress, {
          delete_template: {
            id,
          },
        })
        .build();
    },
    {
      txKey: TX_KEY.DELETE_TEMPLATE,
    }
  );
};
