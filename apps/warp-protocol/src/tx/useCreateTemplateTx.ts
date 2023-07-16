import { useTx } from '@terra-money/apps/libs/transactions';
import { useWarpSdk } from '@terra-money/apps/hooks';
import { warp_resolver } from '../types/contracts';
import { TX_KEY } from './txKey';

export type CreateTemplateTxProps = warp_resolver.SubmitTemplateMsg;

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
