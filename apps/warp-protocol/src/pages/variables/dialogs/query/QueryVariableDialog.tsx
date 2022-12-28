import { DialogProps, useDialog } from '@terra-money/apps/hooks';

import { Dialog, DialogBody, DialogFooter, DialogHeader } from 'components/dialog';

import styles from './QueryVariableDialog.module.sass';

import { Button } from 'components/primitives';
import { QueryVariableForm } from 'pages/variables/details/query/QueryVariableForm';
import { QueryVariable } from 'pages/variables/useVariableStorage';

export type QueryVariableDialogProps = {
  variable?: QueryVariable;
};

export const QueryVariableDialog = (props: DialogProps<QueryVariableDialogProps, QueryVariable>) => {
  const { closeDialog, variable } = props;

  return (
    <Dialog className={styles.dialog}>
      <DialogHeader title="New query variable" onClose={() => closeDialog(undefined)} />
      <DialogBody>
        <QueryVariableForm
          className={styles.form}
          selectedVariable={variable}
          renderActions={(state) => {
            const { submitDisabled } = state;

            return (
              <DialogFooter className={styles.footer}>
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

export const useQueryVariableDialog = () => {
  return useDialog<QueryVariableDialogProps, QueryVariable>(QueryVariableDialog);
};
