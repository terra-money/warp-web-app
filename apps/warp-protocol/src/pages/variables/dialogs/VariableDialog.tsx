import { Button, Text } from 'components/primitives';
import { useDialog, DialogProps } from '@terra-money/apps/hooks';
import { Dialog, DialogBody, DialogHeader } from 'components/dialog';
import styles from './VariableDialog.module.sass';
import { useStaticVariableDialog } from './static/StaticVariableDialog';
import { useQueryVariableDialog } from './query/QueryVariableDialog';
import { useExternalVariableDialog } from './external/ExternalVariableDialog';
import { warp_controller } from 'types/contracts/warp_controller';

type VariableDialogProps = {};

export const VariableDialog = (props: DialogProps<VariableDialogProps, warp_controller.Variable>) => {
  const { closeDialog } = props;

  const openStaticVariableDialog = useStaticVariableDialog();
  const openQueryVariableDialog = useQueryVariableDialog();
  const openExternalVariableDialog = useExternalVariableDialog();

  return (
    <Dialog className={styles.root}>
      <DialogHeader title="Select variable type" onClose={() => closeDialog(undefined)} />
      <DialogBody className={styles.body}>
        <Text variant="label" className={styles.description}>
          Use variables to extend jobs or templates with dynamic behavior at time of job execution.
        </Text>
        <Button
          variant="secondary"
          className={styles.btn}
          onClick={async () => {
            const v = await openQueryVariableDialog({});
            if (v) {
              closeDialog({ query: v });
            }
          }}
        >
          <Text variant="text">Query</Text>
        </Button>
        <Button
          variant="secondary"
          className={styles.btn}
          onClick={async () => {
            const v = await openExternalVariableDialog({});
            if (v) {
              closeDialog({ external: v });
            }
          }}
        >
          <Text variant="text">External</Text>
        </Button>
        <Button
          variant="secondary"
          className={styles.btn}
          onClick={async () => {
            const v = await openStaticVariableDialog({});
            if (v) {
              closeDialog({ static: v });
            }
          }}
        >
          <Text variant="text">Static</Text>
        </Button>
      </DialogBody>
    </Dialog>
  );
};

export const useVariableDialog = () => {
  return useDialog<VariableDialogProps, warp_controller.Variable>(VariableDialog);
};
