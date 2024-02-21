import { DialogProps, useDialog } from '@terra-money/apps/hooks';
import { Dialog, DialogBody, DialogFooter, DialogHeader } from 'components/dialog';
import { Button, Link, Text } from 'components/primitives';
import styles from './UpdateFnDialog.module.sass';
import { UpdateFnNode } from './UpdateFnNode';
import { warp_resolver } from '@terra-money/warp-sdk';
import { isEmpty } from 'lodash';
import { useState } from 'react';

export type UpdateFnDialogProps = {
  kind: warp_resolver.VariableKind;
  updateFn?: warp_resolver.FnValue;
};

export const UpdateFnDialog = (props: DialogProps<UpdateFnDialogProps, warp_resolver.FnValue>) => {
  const { closeDialog, updateFn, kind } = props;

  const [updateFnState, setUpdateFnState] = useState<warp_resolver.FnValue | undefined>(updateFn);

  return (
    <Dialog className={styles.dialog}>
      <DialogHeader title="Update function" onClose={() => closeDialog(undefined)} />
      <DialogBody className={styles.body}>
        <Text className={styles.description} variant="label">
          Using the builder below you may construct a {kind} expression which will be used to update the variable state
          after recurring job execution.
        </Text>
        {!isEmpty(updateFnState) && (
          <Link className={styles.back} onClick={() => setUpdateFnState(undefined)}>
            Clear all
          </Link>
        )}
        <UpdateFnNode className={styles.builder} kind={kind} updateFn={updateFnState} setUpdateFn={setUpdateFnState} />
      </DialogBody>
      <DialogFooter className={styles.footer}>
        <Button
          variant="primary"
          onClick={async () => {
            closeDialog(updateFnState);
          }}
        >
          Save
        </Button>
        <Button variant="secondary" onClick={() => closeDialog(undefined)}>
          Cancel
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export const useUpdateFnDialog = () => {
  return useDialog<UpdateFnDialogProps, warp_resolver.FnValue>(UpdateFnDialog);
};
