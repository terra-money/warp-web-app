import { DialogProps, useDialog } from '@terra-money/apps/hooks';

import { Dialog, DialogBody, DialogFooter, DialogHeader } from 'components/dialog';

import styles from './QueryVariableDialog.module.sass';

import { Button } from 'components/primitives';
import { QueryVariableForm } from 'pages/variables/details/query/QueryVariableForm';
import { parseQuery } from 'utils';
import { warp_controller } from 'types';

export type QueryVariableDialogProps = {
  variable?: warp_controller.QueryVariable;
};

export const QueryVariableDialog = (props: DialogProps<QueryVariableDialogProps, warp_controller.QueryVariable>) => {
  const { closeDialog, variable } = props;

  return (
    <Dialog className={styles.dialog}>
      <DialogHeader title="New query variable" onClose={() => closeDialog(undefined)} />
      <DialogBody>
        <QueryVariableForm
          className={styles.form}
          selectedVariable={variable}
          renderActions={(state) => {
            const { submitDisabled, name, queryJson, querySelector, kind } = state;

            return (
              <DialogFooter className={styles.footer}>
                <Button
                  variant="primary"
                  disabled={submitDisabled}
                  onClick={async () => {
                    if (!submitDisabled) {
                      closeDialog({
                        reinitialize: false,
                        name,
                        init_fn: { query: parseQuery(queryJson), selector: querySelector },
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

export const useQueryVariableDialog = () => {
  return useDialog<QueryVariableDialogProps, warp_controller.QueryVariable>(QueryVariableDialog);
};
