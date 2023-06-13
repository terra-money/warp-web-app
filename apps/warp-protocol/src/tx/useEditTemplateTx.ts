import { useContractAddress } from '@terra-money/apps/hooks';
import { useTx, TxBuilder } from '@terra-money/apps/libs/transactions';
import { warp_resolver } from '../types/contracts';
import { TX_KEY } from './txKey';

export type EditTemplateTxProps = {
  name: string;
  id: string;
};

type EditTemplateMsg = Extract<warp_resolver.ExecuteMsg, { edit_template: {} }>;

export const useEditTemplateTx = () => {
  const contractAddress = useContractAddress('warp-resolver');

  return useTx<EditTemplateTxProps>(
    (options) => {
      const { wallet, name, id } = options;

      return TxBuilder.new()
        .execute<EditTemplateMsg>(wallet.walletAddress, contractAddress, {
          edit_template: {
            id,
            name,
          },
        })
        .build();
    },
    {
      txKey: TX_KEY.EDIT_TEMPLATE,
    }
  );
};
