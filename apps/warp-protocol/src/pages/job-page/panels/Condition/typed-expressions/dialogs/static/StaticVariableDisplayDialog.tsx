import { DialogProps, useDialog } from '@terra-money/apps/hooks';

import { Dialog, DialogBody, DialogFooter, DialogHeader } from 'components/dialog';

import styles from './StaticVariableDisplayDialog.module.sass';

import { Button, Text } from 'components/primitives';
import { warp_resolver } from '@terra-money/warp-sdk';
import { UpdateFnValue } from '../expression/UpdateFnValue';
import { Job } from 'types/job';
import { FormControl } from 'components/form-control/FormControl';

export type StaticVariableDisplayDialogProps = {
  variable: warp_resolver.StaticVariable;
  job: Job;
};

export const StaticVariableDisplayDialog = (props: DialogProps<StaticVariableDisplayDialogProps>) => {
  const { closeDialog, variable, job } = props;

  return (
    <Dialog className={styles.dialog}>
      <DialogHeader title="Static variable" onClose={() => closeDialog(undefined, { closeAll: true })} />
      <DialogBody className={styles.body}>
        <FormControl className={styles.name} labelVariant="secondary" label="Name">
          <Text variant="text">{variable.name}</Text>
        </FormControl>
        <FormControl className={styles.kind} labelVariant="secondary" label="Kind">
          <Text variant="text">{variable.kind}</Text>
        </FormControl>
        <FormControl className={styles.value} labelVariant="secondary" label="Value">
          {variable.value ? <Text variant="text">{variable.value}</Text> : <Text variant="text">-</Text>}
        </FormControl>
        <FormControl className={styles.onSuccess} labelVariant="secondary" label="On Success">
          {variable.update_fn?.on_success ? (
            <UpdateFnValue value={variable.update_fn.on_success} job={job} />
          ) : (
            <Text variant="text">-</Text>
          )}
        </FormControl>
        <FormControl className={styles.onError} labelVariant="secondary" label="On Error">
          {variable.update_fn?.on_error ? (
            <UpdateFnValue value={variable.update_fn.on_error} job={job} />
          ) : (
            <Text variant="text">-</Text>
          )}
        </FormControl>
        <DialogFooter className={styles.footer}>
          <Button variant="secondary" onClick={() => closeDialog(undefined, { closeAll: true })}>
            Close
          </Button>
        </DialogFooter>
      </DialogBody>
    </Dialog>
  );
};

export const useStaticVariableDisplayDialog = () => {
  return useDialog<StaticVariableDisplayDialogProps>(StaticVariableDisplayDialog);
};
