import { DialogProps, useDialog, useWarpSdk } from '@terra-money/apps/hooks';

import { Dialog, DialogBody, DialogFooter, DialogHeader } from 'components/dialog';

import styles from './QueryVariableDisplayDialog.module.sass';

import { Button, Text, Throbber } from 'components/primitives';
import { Job, variableName, warp_resolver } from '@terra-money/warp-sdk';
import { UpdateFnValue } from '../expression/UpdateFnValue';
import { FormControl } from 'components/form-control/FormControl';
import { EditorInput } from 'forms/QueryExprForm/EditorInput';
import { usePreviewQueryDialog } from 'components/dialog/preview-query/PreviewQueryDialog';
import { useEffect, useMemo, useState } from 'react';

export type QueryVariableDisplayDialogProps = {
  variable: warp_resolver.QueryVariable;
  variables: warp_resolver.Variable[];
};

type LoadingState = 'waiting' | 'loading' | 'loaded' | 'error';

export const QueryVariableDisplayDialog = (props: DialogProps<QueryVariableDisplayDialogProps>) => {
  const { closeDialog, variable, variables } = props;

  const openPreview = usePreviewQueryDialog();

  const warpSdk = useWarpSdk();

  const [hydratedVars, setHydratedVars] = useState<warp_resolver.Variable[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>('waiting');

  useEffect(() => {
    async function load() {
      setLoadingState('loading');

      try {
        const job = await warpSdk.replaceVariableReferences({ vars: variables } as Job);

        setHydratedVars(job.vars);
        setLoadingState('loaded');
      } catch (err) {
        setLoadingState('error');
      }
    }

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const endLabel = useMemo(() => {
    if (loadingState === 'loaded') {
      const hydratedVar = hydratedVars.find((v) => variableName(v) === variable.name)! as {
        query: warp_resolver.QueryVariable;
      };

      return (
        <Text
          variant="label"
          onClick={() => openPreview({ query: JSON.stringify(hydratedVar.query.init_fn.query) })}
          className={styles.preview}
        >
          Preview Query Result
        </Text>
      );
    }

    if (loadingState === 'loading') {
      return <Throbber />;
    }

    if (loadingState === 'error') {
      return <Text variant="text">Could not fetch query result</Text>;
    }

    return undefined;
  }, [hydratedVars, loadingState, openPreview, variable.name]);

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
          <div className={styles.preview_result}>{endLabel}</div>
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
