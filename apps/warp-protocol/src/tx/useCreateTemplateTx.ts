import { useContractAddress } from '@terra-money/apps/hooks';
import { useTx, TxBuilder } from '@terra-money/apps/libs/transactions';
import { warp_controller } from '../types/contracts';
import { TX_KEY } from './txKey';

export type CreateTemplateTxProps = warp_controller.SubmitTemplateMsg;

type SubmitTemplateMsg = Extract<warp_controller.ExecuteMsg, { submit_template: {} }>;

export const useCreateTemplateTx = () => {
  const contractAddress = useContractAddress('warp-controller');

  return useTx<CreateTemplateTxProps>(
    (options) => {
      const { wallet, formatted_str, kind, vars, name, msg, condition } = options;

      return TxBuilder.new()
        .execute<SubmitTemplateMsg>(wallet.walletAddress, contractAddress, {
          submit_template: {
            formatted_str,
            kind,
            condition,
            vars,
            name,
            msg,
          },
        })
        .build();
    },
    {
      txKey: TX_KEY.CREATE_TEMPLATE,
    }
  );
};
