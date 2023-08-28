import { useTx } from '@terra-money/apps/libs/transactions';
import { useWarpSdk } from '@terra-money/apps/hooks';
import { TX_KEY } from './txKey';
import { warp_templates } from '@terra-money/warp-sdk';

export type DeleteTemplateTxProps = warp_templates.DeleteTemplateMsg;

export const useDeleteTemplateTx = () => {
  const sdk = useWarpSdk();

  return useTx<DeleteTemplateTxProps>(
    async (options) => {
      const { wallet, id } = options;

      return sdk.tx.deleteTemplate(wallet.walletAddress, id);
    },
    {
      txKey: TX_KEY.DELETE_TEMPLATE,
    }
  );
};
