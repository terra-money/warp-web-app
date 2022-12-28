import { DialogProps, useDialog } from '@terra-money/apps/hooks';

import { Dialog, DialogBody, DialogFooter, DialogHeader } from 'components/dialog';

import styles from './ExternalVariableDialog.module.sass';

import { Button } from 'components/primitives';
import { warp_controller } from 'types/contracts/warp_controller';
import { ExternalVariableForm } from 'pages/variables/details/external/ExternalVariableForm';

export type ExternalVariableDialogProps = {
  variable?: warp_controller.ExternalVariable;
};

export const ExternalVariableDialog = (
  props: DialogProps<ExternalVariableDialogProps, warp_controller.ExternalVariable>
) => {
  const { closeDialog, variable } = props;

  return (
    <Dialog>
      <DialogHeader title="New external variable" onClose={() => closeDialog(undefined)} />
      <DialogBody>
        <ExternalVariableForm
          className={styles.form}
          selectedVariable={variable}
          renderActions={(state) => {
            const { submitDisabled } = state;

            return (
              <DialogFooter>
                <Button variant="primary" disabled={submitDisabled} onClick={async () => {}}>
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

export const useExternalVariableDialog = () => {
  return useDialog<ExternalVariableDialogProps, warp_controller.ExternalVariable>(ExternalVariableDialog);
};