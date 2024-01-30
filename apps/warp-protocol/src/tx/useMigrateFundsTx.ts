import { useTx } from '@terra-money/apps/libs/transactions';
import { TX_KEY } from './txKey';
import { useWarpSdk, useWarpSdkv2 } from '@terra-money/apps/hooks';
import Big from 'big.js';
import { NativeToken, u } from '@terra-money/apps/types';
import { Coin } from '@terra-money/feather.js';

interface MigrateFundsTxProps {
  amount: u<Big>;
  token: NativeToken;
}

export const useMigrateFundsTx = (waitForCompletion?: boolean) => {
  const sdkv2 = useWarpSdkv2();
  const sdkv1 = useWarpSdk();

  return useTx<MigrateFundsTxProps>(
    async (options) => {
      const { wallet, amount, token } = options;

      const withdrawFromAccountTx = await sdkv1.tx.withdrawFromAccount(
        wallet.walletAddress,
        wallet.walletAddress,
        token,
        amount.toString()
      );
      const createFundingAccountTx = await sdkv2.tx.createFundingAccount(wallet.walletAddress, [
        new Coin(token.denom, amount.toString()),
      ]);

      const msgs = [...withdrawFromAccountTx.msgs, ...createFundingAccountTx.msgs];

      return {
        msgs,
        chainID: sdkv2.chain.config.chainID,
      };
    },
    {
      txKey: TX_KEY.MIGRATE_FUNDS,
    },
    {
      waitForCompletion,
    }
  );
};
