import { Button, Text } from 'components/primitives';
import { useDialog, DialogProps, useLocalWallet } from '@terra-money/apps/hooks';
import { Dialog, DialogBody, DialogFooter, DialogHeader } from 'components/dialog';
import styles from './MigrateFundsDialog.module.sass';
import { useMigrateFundsTx } from 'tx/useMigrateFundsTx';
import { useNativeToken } from 'hooks/useNativeToken';
import { useTokenBalanceQuery } from 'queries/useTokenBalanceQuery';
import Big from 'big.js';
import { u } from '@terra-money/apps/types';
import { FormControl } from 'components/form-control/FormControl';
import { TokenAmount } from 'components/token-amount';

type MigrateFundsDialogProps = {};

export const MigrateFundsDialog = (props: DialogProps<MigrateFundsDialogProps, boolean>) => {
  const { closeDialog } = props;

  const { walletAddress } = useLocalWallet();

  const [txResult, migrateFundsTx] = useMigrateFundsTx(true);

  const nativeToken = useNativeToken();

  const { data: walletBalance = Big(0) as u<Big>, isLoading: isWalletBalanceLoading } = useTokenBalanceQuery(
    walletAddress,
    nativeToken
  );

  return (
    <Dialog className={styles.root}>
      <DialogHeader title="Migrate funds" onClose={() => closeDialog(undefined, { closeAll: true })} />
      <DialogBody className={styles.body}>
        <Text variant="label" className={styles.description}>
          Your remaining Warp account balance is being transferred over to a newly created funding account on Warp v2.
        </Text>
        <FormControl labelVariant="secondary" label="Warp account balance to be migrated" className={styles.balance}>
          {!isWalletBalanceLoading ? (
            <TokenAmount
              className={styles.text}
              variant="text"
              decimals={2}
              token={nativeToken}
              amount={Big(walletBalance) as u<Big>}
              showSymbol={true}
              showUsdAmount={true}
            />
          ) : (
            <Text variant="text" className={styles.text}>
              Fetching balance...
            </Text>
          )}
        </FormControl>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="primary"
          className={styles.btn}
          loading={txResult.loading}
          onClick={async () => {
            const result = await migrateFundsTx({ amount: walletBalance, token: nativeToken });

            if (result.code !== 0) {
              closeDialog(true);
            }
          }}
        >
          Migrate funds
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export const useMigrateFundsDialog = () => {
  return useDialog<MigrateFundsDialogProps, boolean>(MigrateFundsDialog);
};
