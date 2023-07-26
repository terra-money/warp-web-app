import { useTx } from '@terra-money/apps/libs/transactions';
import { useWarpSdk } from '@terra-money/apps/hooks';
import { TX_KEY } from './txKey';

export type EditTemplateTxProps = {
  name: string;
  id: string;
};

export const useEditTemplateTx = () => {
  const sdk = useWarpSdk();

  return useTx<EditTemplateTxProps>(
    async (options) => {
      const { wallet, name, id } = options;

      return sdk.tx.editTemplate(wallet.walletAddress, {
        id,
        name,
      });
    },
    {
      txKey: TX_KEY.EDIT_TEMPLATE,
    }
  );
};
