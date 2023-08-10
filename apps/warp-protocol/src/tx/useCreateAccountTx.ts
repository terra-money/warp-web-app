import { useTx } from '@terra-money/apps/libs/transactions';
import { useWarpSdk } from '@terra-money/apps/hooks';
import { TX_KEY } from './txKey';

export interface CreateAccountTxProps {}

export const useCreateAccountTx = () => {
  const sdk = useWarpSdk();

  return useTx<CreateAccountTxProps>(
    async (options) => {
      const { wallet } = options;

      return sdk.tx.createAccount(wallet.walletAddress);
    },
    {
      txKey: TX_KEY.CREATE_ACCOUNT,
    }
  );
};
