import { useTx } from '@terra-money/apps/libs/transactions';
import { useWarpSdk } from '@terra-money/apps/hooks';
import { TX_KEY } from './txKey';
import { warp_templates } from '@terra-money/warp-sdk';

export type CreateTemplateTxProps = warp_templates.SubmitTemplateMsg;

export const useCreateTemplateTx = () => {
  const sdk = useWarpSdk();

  return useTx<CreateTemplateTxProps>(
    async (options) => {
      const { wallet, formatted_str, vars, name, msg, condition } = options;

      return sdk.tx.submitTemplate(wallet.walletAddress, {
        formatted_str,
        condition,
        vars,
        name,
        msg,
      });
    },
    {
      txKey: TX_KEY.CREATE_TEMPLATE,
    }
  );
};
