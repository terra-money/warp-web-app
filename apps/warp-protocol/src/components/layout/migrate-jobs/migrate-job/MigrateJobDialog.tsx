import { Button, Text } from 'components/primitives';
import { useDialog, DialogProps } from '@terra-money/apps/hooks';
import { Dialog, DialogBody, DialogFooter, DialogHeader } from 'components/dialog';
import styles from './MigrateJobDialog.module.sass';
import { FormControl } from 'components/form-control/FormControl';
import { useMigrateJobTx } from 'tx/useMigrateJobTx';
import { Job } from 'types';
import { NumericInput } from 'components/primitives/numeric-input';
import { useMigrateJobForm } from './useMigrateJobForm';
import { FundingAccountInput } from './funding-account-input/FundingAccountInput';
import { TokenInput } from 'pages/balances/token-input/TokenInput';
import { AmountInput } from 'pages/dashboard/jobs-widget/inputs/AmountInput';
import { demicrofy, microfy } from '@terra-money/apps/libs/formatting';
import Big from 'big.js';

type MigrateJobDialogProps = {
  job: Job;
};

export const MigrateJobDialog = (props: DialogProps<MigrateJobDialogProps, boolean>) => {
  const { closeDialog, job } = props;

  const [txResult, migrateJobTx] = useMigrateJobTx(true);

  const [
    input,
    { durationDays, submitDisabled, fundingAccount, token, amount, amountError, balance, balanceLoading, amountValid },
  ] = useMigrateJobForm();

  return (
    <Dialog className={styles.root}>
      <DialogHeader title="Migrate job" onClose={() => closeDialog(undefined, { closeAll: true })} />
      <DialogBody className={styles.body}>
        <Text variant="label" className={styles.description}>
          You may specify additional fields such as duration of stay, optional funding account or job funds. Job funds
          are drawn from the wallet. In case you want to provide Warp account funds, first withdraw the assets to your
          wallet.
        </Text>
        <FormControl className={styles.duration_days_input} label="Duration (in days)">
          <NumericInput
            placeholder="Type number of days"
            value={durationDays}
            onChange={(value) =>
              input({
                durationDays: value.target.value,
              })
            }
          />
        </FormControl>
        <FundingAccountInput
          optional={true}
          className={styles.funding_account}
          label="Funding account"
          value={fundingAccount}
          onChange={(acc) => input({ fundingAccount: acc })}
        />
        <TokenInput
          optional={true}
          className={styles.token_input}
          label="Token"
          value={token}
          onChange={(token) => {
            input({ token });
          }}
        />

        <AmountInput
          optional={true}
          label="Amount"
          className={styles.amount_input}
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
          disabled={submitDisabled}
          loading={txResult.loading}
          onClick={async () => {
            let parsedAmount = token && amount ? microfy(Big(amount), token?.decimals) : undefined;

            const result = await migrateJobTx({ job, durationDays, fundingAccount, amount: parsedAmount, token });

            if (result.code !== 0) {
              closeDialog(true);
            }
          }}
        >
          Migrate job
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export const useMigrateJobDialog = () => {
  return useDialog<MigrateJobDialogProps, boolean>(MigrateJobDialog);
};
