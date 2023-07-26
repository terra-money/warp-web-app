import { useTx } from '@terra-money/apps/libs/transactions';
import { useWarpSdk } from '@terra-money/apps/hooks';
import { warp_resolver } from '../types/contracts';
import { TX_KEY } from './txKey';

export type DeleteTemplateTxProps = warp_resolver.DeleteTemplateMsg;

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
