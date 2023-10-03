import { useTx } from '@terra-money/apps/libs/transactions';
import { useWarpSdk } from '@terra-money/apps/hooks';
import { TX_KEY } from './txKey';
import { warp_resolver } from '@terra-money/warp-sdk';

export type CreateTemplateTxProps = {
  condition?: warp_resolver.Condition | null;
  formatted_str: string;
  msgs: warp_resolver.CosmosMsgFor_Empty[];
  name: string;
  vars: warp_resolver.Variable[];
};

export const useCreateTemplateTx = () => {
  const sdk = useWarpSdk();

  return useTx<CreateTemplateTxProps>(
    async (options) => {
      const { wallet, formatted_str, vars, name, msgs, condition } = options;

      return sdk.tx.submitTemplate(wallet.walletAddress, {
        formatted_str,
        condition,
        vars,
        name,
        msg: JSON.stringify(msgs),
      });
    },
    {
      txKey: TX_KEY.CREATE_TEMPLATE,
    }
  );
};
