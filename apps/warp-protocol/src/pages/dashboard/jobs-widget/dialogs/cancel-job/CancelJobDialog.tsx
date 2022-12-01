import { Button, Text } from 'components/primitives';
import { DialogProps, useDialog } from '@terra-money/apps/hooks';
import { Form } from 'components/form/Form';
import { Dialog, DialogBody, DialogFooter, DialogHeader } from 'components/dialog';
import styles from './CancelJobDialog.module.sass';
import { Job } from 'types/job';
import { useCancelJobTx } from 'tx';

export type CancelJobDialogProps = {
  job: Job;
};

export const CancelJobDialog = (props: DialogProps<CancelJobDialogProps>) => {
  const { closeDialog, job } = props;

  const [txResult, cancelJobTx] = useCancelJobTx();

  return (
    <Dialog>
      <Form>
        <DialogHeader title="Cancel job" onClose={() => closeDialog(undefined)} />
        <DialogBody>
          <Text variant="text" className={styles.description}>
            Are you sure you want to cancel job {job.info.name} (#{job.info.id}) ?
          </Text>
        </DialogBody>
        <DialogFooter>
          <Button
            className={styles.btn}
            variant="primary"
            loading={txResult.loading}
            onClick={async () => {
              const resp = await cancelJobTx({ jobId: job.info.id });

              if (resp.success) {
                closeDialog(undefined, { closeAll: true });
              }
            }}
          >
            Proceed
          </Button>
          <Button className={styles.btn} variant="secondary" onClick={() => closeDialog()}>
            Cancel
          </Button>
        </DialogFooter>
      </Form>
    </Dialog>
  );
};

export const useCancelJobDialog = () => {
  return useDialog<CancelJobDialogProps>(CancelJobDialog);
};
