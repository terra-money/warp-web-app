import { DialogProps, useDialog } from '@terra-money/apps/hooks';

import { Dialog, DialogBody, DialogFooter, DialogHeader } from 'components/dialog';

import styles from './StaticVariableDialog.module.sass';

import { Button } from 'components/primitives';
import { warp_controller } from 'types/contracts/warp_controller';
import { StaticVariableForm } from 'pages/variables/details/static/StaticVariableForm';

export type StaticVariableDialogProps = {
  variable?: warp_controller.StaticVariable;
};

export const StaticVariableDialog = (props: DialogProps<StaticVariableDialogProps, warp_controller.StaticVariable>) => {
  const { closeDialog, variable } = props;

  return (
    <Dialog className={styles.dialog}>
      <DialogHeader title="New static variable" onClose={() => closeDialog(undefined)} />
      <DialogBody>
        <StaticVariableForm
          className={styles.form}
          selectedVariable={variable}
          renderActions={(state) => {
            const { submitDisabled, name, value, kind } = state;

            return (
              <DialogFooter className={styles.footer}>
                <Button
                  variant="primary"
                  disabled={submitDisabled}
                  onClick={async () => {
                    if (!submitDisabled) {
                      closeDialog({
                        name,
                        default_value: value,
                        kind,
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
  return useDialog<StaticVariableDialogProps, warp_controller.StaticVariable>(StaticVariableDialog);
};
