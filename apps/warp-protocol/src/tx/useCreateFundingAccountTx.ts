import { useTx } from '@terra-money/apps/libs/transactions';
import { TX_KEY } from './txKey';
import { useWarpSdk } from '@terra-money/apps/hooks';

interface CreateFundingAccountTxProps {}

export const useCreateFundingAccountTx = () => {
  const sdk = useWarpSdk();

  return useTx<CreateFundingAccountTxProps>(
    async (options) => {
      const { wallet } = options;

      return sdk.tx.createFundingAccount(wallet.walletAddress);
    },
    {
      txKey: TX_KEY.CREATE_FUNDING_ACCOUNT,
    }
  );
};
