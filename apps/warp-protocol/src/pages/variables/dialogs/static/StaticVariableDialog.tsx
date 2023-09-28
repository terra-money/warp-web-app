import { DialogProps, useDialog } from '@terra-money/apps/hooks';

import { Dialog, DialogBody, DialogFooter, DialogHeader } from 'components/dialog';

import styles from './StaticVariableDialog.module.sass';

import { Button } from 'components/primitives';
import { warp_resolver } from '@terra-money/warp-sdk';
import { StaticVariableForm } from 'pages/variables/details/static/StaticVariableForm';

export type StaticVariableDialogProps = {
  variable?: warp_resolver.StaticVariable;
};

export const StaticVariableDialog = (props: DialogProps<StaticVariableDialogProps, warp_resolver.StaticVariable>) => {
  const { closeDialog, variable } = props;

  return (
    <Dialog className={styles.dialog}>
      <DialogHeader title="New static variable" onClose={() => closeDialog(undefined)} />
      <DialogBody>
        <StaticVariableForm
          className={styles.form}
          selectedVariable={variable}
          renderActions={(state) => {
            const { submitDisabled, name, value, kind, onError, onSuccess } = state;

            return (
              <DialogFooter className={styles.footer}>
                <Button
                  variant="primary"
                  disabled={submitDisabled}
                  onClick={async () => {
                    if (!submitDisabled) {
                      closeDialog({
                        name,
                        value,
                        kind,
                        update_fn: {
                          on_success: onSuccess,
                          on_error: onError,
                        },
                        encode: false,
                      });
                    }
                  }}
                >
                  Save
                </Button>
                <Button variant="secondary" onClick={() => closeDialog(undefined)}>
                  Cancel
                </Button>
              </DialogFooter>
            );
          }}
        />
      </DialogBody>
    </Dialog>
  );
};

export const useStaticVariableDialog = () => {
  return useDialog<StaticVariableDialogProps, warp_resolver.StaticVariable>(StaticVariableDialog);
};
