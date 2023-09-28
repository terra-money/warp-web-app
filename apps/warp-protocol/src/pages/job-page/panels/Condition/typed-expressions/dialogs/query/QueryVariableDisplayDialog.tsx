import { DialogProps, useDialog } from '@terra-money/apps/hooks';

import { Dialog, DialogBody, DialogFooter, DialogHeader } from 'components/dialog';

import styles from './QueryVariableDisplayDialog.module.sass';

import { Button, Text } from 'components/primitives';
import { warp_resolver } from '@terra-money/warp-sdk';
import { UpdateFnValue } from '../expression/UpdateFnValue';
import { FormControl } from 'components/form-control/FormControl';
import { EditorInput } from 'forms/QueryExprForm/EditorInput';

export type QueryVariableDisplayDialogProps = {
  variable: warp_resolver.QueryVariable;
  variables: warp_resolver.Variable[];
};

export const QueryVariableDisplayDialog = (props: DialogProps<QueryVariableDisplayDialogProps>) => {
  const { closeDialog, variable, variables } = props;

  return (
    <Dialog className={styles.dialog}>
      <DialogHeader title="Query variable" onClose={() => closeDialog(undefined, { closeAll: true })} />
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
        <FormControl className={styles.reinitialize} labelVariant="secondary" label="Reinitialize">
          <Text variant="text">{variable.reinitialize ? 'true' : 'false'}</Text>
        </FormControl>
        <FormControl className={styles.query} labelVariant="secondary" label="Query">
          <EditorInput
            rootClassName={styles.msg}
            className={styles.msg_editor}
            value={JSON.stringify(variable.init_fn.query, null, 2)}
            readOnly={true}
          />
        </FormControl>
        <FormControl className={styles.selector} labelVariant="secondary" label="Selector">
          <Text variant="text">{variable.init_fn.selector}</Text>
        </FormControl>
        <FormControl className={styles.onSuccess} labelVariant="secondary" label="On Success">
          {variable.update_fn?.on_success ? (
            <UpdateFnValue value={variable.update_fn.on_success} variables={variables} />
          ) : (
            <Text variant="text">-</Text>
          )}
        </FormControl>
        <FormControl className={styles.onError} labelVariant="secondary" label="On Error">
          {variable.update_fn?.on_error ? (
            <UpdateFnValue value={variable.update_fn.on_error} variables={variables} />
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

export const useQueryVariableDisplayDialog = () => {
  return useDialog<QueryVariableDisplayDialogProps>(QueryVariableDisplayDialog);
};
