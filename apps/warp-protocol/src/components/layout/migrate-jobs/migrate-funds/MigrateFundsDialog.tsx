import { Button, Text } from 'components/primitives';
import { useDialog, DialogProps } from '@terra-money/apps/hooks';
import { Dialog, DialogBody, DialogFooter, DialogHeader } from 'components/dialog';
import styles from './MigrateFundsDialog.module.sass';
import { useMigrateFundsTx } from 'tx/useMigrateFundsTx';
import { useNativeToken } from 'hooks/useNativeToken';
import { useMigrateFundsForm } from './useMigrateFundsForm';
import { AmountInput } from 'pages/dashboard/jobs-widget/inputs/AmountInput';
import { demicrofy, microfy } from '@terra-money/apps/libs/formatting';
import { useWarpAccount } from 'queries/useWarpAccount';

type MigrateFundsDialogProps = {};

export const MigrateFundsDialog = (props: DialogProps<MigrateFundsDialogProps, boolean>) => {
  const { closeDialog } = props;

  const [txResult, migrateFundsTx] = useMigrateFundsTx(true);

  const nativeToken = useNativeToken();

  const { data: warpAccount } = useWarpAccount();

  const [input, { token, balance, balanceLoading, amount, amountValid, amountError, submitDisabled }] =
    useMigrateFundsForm(nativeToken, warpAccount?.account!);

  return (
    <Dialog className={styles.root}>
      <DialogHeader title="Migrate funds" onClose={() => closeDialog(undefined, { closeAll: true })} />
      <DialogBody className={styles.body}>
        <Text variant="label" className={styles.description}>
          Your remaining Warp account balance is being transferred over to a newly created funding account on Warp v2.
        </Text>
        <AmountInput
          className={styles.balance}
          label="Warp account balance to be migrated"
          value={amount}
          onChange={(value) =>
            input({
              amount: value.target.value,
            })
          }
          onBalanceClick={(value) => {
            if (token) {
              input({
                amount: demicrofy(value, token?.decimals).toString(),
              });
            }
          }}
          error={amountError}
          balance={balance}
          balanceLoading={balanceLoading}
          token={token}
          valid={amountValid}
        />
      </DialogBody>
      <DialogFooter>
        <Button
          variant="primary"
          className={styles.btn}
          loading={txResult.loading}
          disabled={submitDisabled}
          onClick={async () => {
            if (amount) {
              const result = await migrateFundsTx({
                amount: microfy(amount, nativeToken.decimals),
                token: nativeToken,
              });

              if (result.code !== 0) {
                closeDialog(true);
              }
            }
          }}
        >
          Migrate funds & Create Funding Account
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export const useMigrateFundsDialog = () => {
  return useDialog<MigrateFundsDialogProps, boolean>(MigrateFundsDialog);
};
