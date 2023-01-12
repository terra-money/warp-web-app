import { Button } from 'components/primitives';
import { useDialog, DialogProps } from '@terra-money/apps/hooks';
import { Dialog, DialogBody, DialogHeader } from 'components/dialog';
import styles from './PreviewExternalDialog.module.sass';
import { EditorInput } from 'forms/QueryExprForm/EditorInput';
import { useExternalQuery } from 'queries/useExternalQuery';

type PreviewExternalDialogProps = {
  url: string;
  method: string;
  body?: string;
};

type PreviewExternalDialogReturnType = void;

export const PreviewExternalDialog = (
  props: DialogProps<PreviewExternalDialogProps, PreviewExternalDialogReturnType>
) => {
  const { closeDialog, url, method, body } = props;

  const { data, isLoading, isFetching, error, refetch } = useExternalQuery(url, method, body);

  const loading = isLoading || isFetching;

  return (
    <Dialog className={styles.root}>
      <DialogHeader title="Response preview" onClose={() => closeDialog(undefined)} />
      <DialogBody className={styles.body}>
        {body && (
          <EditorInput
            rootClassName={styles.msg}
            className={styles.msg_editor}
            value={body}
            readOnly={true}
            label="Request"
          />
        )}
        <EditorInput
          rootClassName={styles.msg}
          className={styles.msg_editor}
          error={error ? 'There was an error making the query.' : undefined}
          value={JSON.stringify(data, null, 2)}
          placeholder="Response will be displayed here."
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

export const usePreviewExternalDialog = () => {
  return useDialog<PreviewExternalDialogProps, PreviewExternalDialogReturnType>(PreviewExternalDialog);
};
