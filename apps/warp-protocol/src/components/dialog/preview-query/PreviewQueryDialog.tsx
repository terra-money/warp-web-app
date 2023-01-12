import { Button } from 'components/primitives';
import { useDialog, DialogProps } from '@terra-money/apps/hooks';
import { Dialog, DialogBody, DialogHeader } from 'components/dialog';
import { useSimulateQuery } from '../../../queries/useSimulateQuery';
import styles from './PreviewQueryDialog.module.sass';
import { EditorInput } from 'forms/QueryExprForm/EditorInput';

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
        <EditorInput
          rootClassName={styles.msg}
          className={styles.msg_editor}
          value={query}
          readOnly={true}
          label="Query"
        />
        <EditorInput
          rootClassName={styles.msg}
          className={styles.msg_editor}
          error={error ? 'There was an error making the query.' : undefined}
          value={JSON.stringify(data, null, 2)}
          placeholder="Query response will be displayed here."
          readOnly={true}
          label="Response"
        />

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
