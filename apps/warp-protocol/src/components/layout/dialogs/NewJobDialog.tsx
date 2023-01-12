import { Button, Text } from 'components/primitives';
import { useDialog, DialogProps } from '@terra-money/apps/hooks';
import { Dialog, DialogBody, DialogHeader } from 'components/dialog';
import styles from './NewJobDialog.module.sass';
import { useNavigate } from 'react-router';
import { useJobStorage } from 'pages/job-new/useJobStorage';
import { Container } from '@terra-money/apps/components';

type NewJobDialogProps = {};

export const NewJobDialog = (props: DialogProps<NewJobDialogProps>) => {
  const { closeDialog } = props;

  const navigate = useNavigate();

  const { clearJobStorage } = useJobStorage();

  return (
    <Dialog className={styles.root}>
      <DialogHeader title="New job" onClose={() => closeDialog(undefined)} />
      <DialogBody className={styles.body}>
        <Text variant="label" className={styles.description}>
          Select an option below to create a job.
        </Text>
        <Button
          variant="secondary"
          className={styles.btn}
          onClick={async () => {
            clearJobStorage();
            navigate('/job-new/details?mode=basic');
            closeDialog(undefined, { closeAll: true });
          }}
        >
          <Container direction="column" className={styles.txt_container}>
            <Text className={styles.text} variant="text">
              Basic mode
            </Text>
            <Text className={styles.label} variant="label">
              Create a job from a library of job templates.
            </Text>
          </Container>
        </Button>
        <Button
          variant="secondary"
          className={styles.btn}
          onClick={async () => {
            clearJobStorage();
            navigate('/job-new/details?mode=advanced');
            closeDialog(undefined, { closeAll: true });
          }}
        >
          <Container direction="column" className={styles.txt_container}>
            <Text className={styles.text} variant="text">
              Advanced mode
            </Text>
            <Text className={styles.label} variant="label">
              Create a job manually. Intended for developers.
            </Text>
          </Container>
        </Button>
      </DialogBody>
    </Dialog>
  );
};

export const useNewJobDialog = () => {
  return useDialog<NewJobDialogProps>(NewJobDialog);
};
