import { Button, Text } from 'components/primitives';
import { useDialog, DialogProps } from '@terra-money/apps/hooks';
import { Dialog, DialogBody, DialogHeader } from 'components/dialog';
import styles from './NewTemplateDialog.module.sass';
import { useNavigate } from 'react-router';
import { useJobStorage } from 'pages/job-new/useJobStorage';
import { Container } from '@terra-money/apps/components';

type NewTemplateDialogProps = {};

export const NewTemplateDialog = (props: DialogProps<NewTemplateDialogProps>) => {
  const { closeDialog } = props;

  const navigate = useNavigate();

  const { clearJobStorage } = useJobStorage();

  return (
    <Dialog className={styles.root}>
      <DialogHeader title="New template" onClose={() => closeDialog(undefined)} />
      <DialogBody className={styles.body}>
        <Text variant="label" className={styles.description}>
          Select an option below to create a job.
        </Text>
        <Button
          variant="secondary"
          className={styles.btn}
          onClick={async () => {
            navigate('/template-new/details?mode=basic');
            closeDialog(undefined, { closeAll: true });
          }}
        >
          <Container direction="column" className={styles.txt_container}>
            <Text className={styles.text} variant="text">
              Basic mode
            </Text>
            <Text className={styles.label} variant="label">
              Create a template with formatted display and message.
            </Text>
          </Container>
        </Button>
        <Button
          variant="secondary"
          className={styles.btn}
          onClick={async () => {
            clearJobStorage();
            navigate('/template-new/details?mode=advanced');
            closeDialog(undefined, { closeAll: true });
          }}
        >
          <Container direction="column" className={styles.txt_container}>
            <Text className={styles.text} variant="text">
              Advanced mode
            </Text>
            <Text className={styles.label} variant="label">
              Enable conditions in job specific templates.
            </Text>
          </Container>
        </Button>
      </DialogBody>
    </Dialog>
  );
};

export const useNewTemplateDialog = () => {
  return useDialog<NewTemplateDialogProps>(NewTemplateDialog);
};
