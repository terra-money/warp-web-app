import { useContractAddress } from '@terra-money/apps/hooks';
import { useTx, TxBuilder } from '@terra-money/apps/libs/transactions';
import { warp_controller } from '../types/contracts';
import { TX_KEY } from './txKey';

export type EditTemplateTxProps = warp_controller.EditTemplateMsg;

type EditTemplateMsg = Extract<warp_controller.ExecuteMsg, { edit_template: {} }>;

export const useEditTemplateTx = () => {
  const contractAddress = useContractAddress('warp-controller');

  return useTx<EditTemplateTxProps>(
    (options) => {
      const { wallet, formatted_str, vars, name, msg, id, condition } = options;

      return TxBuilder.new()
        .execute<EditTemplateMsg>(wallet.walletAddress, contractAddress, {
          edit_template: {
            id,
            formatted_str,
            condition,
            vars,
            name,
            msg,
          },
        })
        .build();
    },
    {
      txKey: TX_KEY.EDIT_TEMPLATE,
    }
  );
};
