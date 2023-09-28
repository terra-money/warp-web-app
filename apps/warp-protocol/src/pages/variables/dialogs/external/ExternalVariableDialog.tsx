import { DialogProps, useDialog } from '@terra-money/apps/hooks';

import { Dialog, DialogBody, DialogFooter, DialogHeader } from 'components/dialog';

import styles from './ExternalVariableDialog.module.sass';

import { Button } from 'components/primitives';
import { warp_resolver } from '@terra-money/warp-sdk';
import { ExternalVariableForm } from 'pages/variables/details/external/ExternalVariableForm';

export type ExternalVariableDialogProps = {
  variable?: warp_resolver.ExternalVariable;
};

export const ExternalVariableDialog = (
  props: DialogProps<ExternalVariableDialogProps, warp_resolver.ExternalVariable>
) => {
  const { closeDialog, variable } = props;

  return (
    <Dialog className={styles.dialog}>
      <DialogHeader title="New external variable" onClose={() => closeDialog(undefined)} />
      <DialogBody>
        <ExternalVariableForm
          className={styles.form}
          selectedVariable={variable}
          renderActions={(state) => {
            const { submitDisabled, name, url, selector, kind, body, method, onError, onSuccess } = state;

            return (
              <DialogFooter className={styles.footer}>
                <Button
                  variant="primary"
                  disabled={submitDisabled}
                  onClick={async () => {
                    if (!submitDisabled) {
                      closeDialog({
                        name,
                        reinitialize: false,
                        init_fn: {
                          url,
                          selector,
                          body,
                          method,
                        },
                        update_fn: {
                          on_success: onSuccess,
                          on_error: onError,
                        },
                        kind,
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

export const useExternalVariableDialog = () => {
  return useDialog<ExternalVariableDialogProps, warp_resolver.ExternalVariable>(ExternalVariableDialog);
};
