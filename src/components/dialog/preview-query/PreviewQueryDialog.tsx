import { Button, Throbber } from 'components/primitives';
import { useDialog, DialogProps } from 'shared/hooks';
import { Dialog, DialogBody, DialogHeader } from 'components/dialog';
import { useSimulateQuery } from '../../../queries/useSimulateQuery';
import styles from './PreviewQueryDialog.module.sass';
import classNames from 'classnames';
import { FormControl } from 'components/form-control/FormControl';

type PreviewQueryDialogProps = {
  query: string;
};

type PreviewQueryDialogReturnType = void;
export const PreviewQueryDialog = (props: DialogProps<PreviewQueryDialogProps, PreviewQueryDialogReturnType>) => {
  const { closeDialog, query } = props;
  const { data, isLoading, isFetching, error, refetch } = useSimulateQuery(query);

  const loading = isLoading || isFetching;

  return (
    <Dialog className={styles.root}>
      <DialogHeader title="Query Preview" onClose={() => closeDialog(undefined)} />
      <DialogBody className={styles.body}>
        <FormControl labelVariant="secondary" label="Query">
          <div className={styles.block}>
            <pre className={styles.block_text}>{query}</pre>
          </div>
        </FormControl>
        <FormControl labelVariant="secondary" label="Response">
          {loading && (
            <div className={classNames(styles.block, styles.center)}>
              <Throbber />
            </div>
          )}

          {!loading && Boolean(data) && (
            <div className={styles.block}>
              <pre className={styles.block_text}>{JSON.stringify(data, null, 2)}</pre>
            </div>
          )}

          {!loading && !data && Boolean(error) && (
            <div className={styles.block}>
              <pre className={styles.block_text}>There was an error making the query</pre>
            </div>
          )}
        </FormControl>
        <Button loading={loading} onClick={() => refetch()}>
          Refetch
        </Button>
      </DialogBody>
    </Dialog>
  );
};

export const usePreviewQueryDialog = () => {
  return useDialog<PreviewQueryDialogProps, PreviewQueryDialogReturnType>(PreviewQueryDialog);
};
