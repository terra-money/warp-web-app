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

type MigrateJobDialogProps = {
  job: Job;
};

export const MigrateJobDialog = (props: DialogProps<MigrateJobDialogProps, boolean>) => {
  const { closeDialog, job } = props;

  const [txResult, migrateJobTx] = useMigrateJobTx(true);

  const [input, { durationDays, submitDisabled, fundingAccount }] = useMigrateJobForm();

  return (
    <Dialog className={styles.root}>
      <DialogHeader title="Migrate job" onClose={() => closeDialog(undefined, { closeAll: true })} />
      <DialogBody className={styles.body}>
        <Text variant="label" className={styles.description}>
          You may specify additional fields such as duration of stay or optionally attach a funding account.
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
          className={styles.funding_account}
          label="Funding account"
          value={fundingAccount}
          onChange={(acc) => input({ fundingAccount: acc })}
        />
      </DialogBody>
      <DialogFooter>
        <Button
          variant="primary"
          className={styles.btn}
          disabled={submitDisabled}
          loading={txResult.loading}
          onClick={async () => {
            const result = await migrateJobTx({ job, durationDays, fundingAccount });

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
