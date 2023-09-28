import { DialogProps, useDialog } from '@terra-money/apps/hooks';
import { Dialog, DialogBody, DialogFooter, DialogHeader } from 'components/dialog';
import { Button, Link } from 'components/primitives';
import styles from './UpdateFnDialog.module.sass';
import { UpdateFnNode } from './UpdateFnNode';
import { warp_resolver } from '@terra-money/warp-sdk';
import { isEmpty } from 'lodash';
import { useState } from 'react';

export type UpdateFnDialogProps = {
  updateFn?: warp_resolver.UpdateFnValue;
};

export const UpdateFnDialog = (props: DialogProps<UpdateFnDialogProps, warp_resolver.UpdateFnValue>) => {
  const { closeDialog, updateFn } = props;

  const [updateFnState, setUpdateFnState] = useState<warp_resolver.UpdateFnValue | undefined>(updateFn);

  return (
    <Dialog className={styles.dialog}>
      <DialogHeader title="Update function" onClose={() => closeDialog(undefined)} />
      <DialogBody className={styles.body}>
        {!isEmpty(updateFnState) && (
          <Link className={styles.back} onClick={() => setUpdateFnState(undefined)}>
            Clear all
          </Link>
        )}
        <UpdateFnNode className={styles.builder} updateFn={updateFnState} setUpdateFn={setUpdateFnState} />
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
  return useDialog<UpdateFnDialogProps, warp_resolver.UpdateFnValue>(UpdateFnDialog);
};
