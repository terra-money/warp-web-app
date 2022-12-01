import { Button, Text } from 'components/primitives';
import { DialogProps, useDialog } from '@terra-money/apps/hooks';
import { Form } from 'components/form/Form';
import { Dialog, DialogBody, DialogFooter, DialogHeader } from 'components/dialog';
import styles from './ExecuteJobDialog.module.sass';
import { Job } from 'types/job';
import { useExecuteJobTx } from 'tx';

export type ExecuteJobDialogProps = {
  job: Job;
};

export const ExecuteJobDialog = (props: DialogProps<ExecuteJobDialogProps>) => {
  const { closeDialog, job } = props;

  const [txResult, executeJobTx] = useExecuteJobTx();

  return (
    <Dialog>
      <Form>
        <DialogHeader title="Execute job" onClose={() => closeDialog(undefined)} />
        <DialogBody>
          <Text variant="text" className={styles.description}>
            Are you sure you want to execute job {job.info.name} (#{job.info.id}) ?
          </Text>
        </DialogBody>
        <DialogFooter>
          <Button
            className={styles.btn}
            variant="primary"
            loading={txResult.loading}
            onClick={async () => {
              const resp = await executeJobTx({ jobId: job.info.id });

              if (resp.success) {
                closeDialog(undefined, { closeAll: true });
              }
            }}
          >
            Execute
          </Button>
          <Button className={styles.btn} variant="secondary" onClick={() => closeDialog()}>
            Cancel
          </Button>
        </DialogFooter>
      </Form>
    </Dialog>
  );
};

export const useExecuteJobDialog = () => {
  return useDialog<ExecuteJobDialogProps>(ExecuteJobDialog);
};
