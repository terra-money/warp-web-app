import { Button, Text } from 'components/primitives';
import { useDialog, DialogProps } from '@terra-money/apps/hooks';
import { Dialog, DialogBody, DialogHeader } from 'components/dialog';
import styles from './NewActionDialog.module.sass';
import { useNewVariableDialog } from 'pages/variables/dialogs/VariableDialog';
import { useNewJobDialog } from './NewJobDialog';
import { ReactComponent as JobsIcon } from 'components/assets/Jobs.svg';
import { ReactComponent as LightningStrokeIcon } from 'components/assets/LightningStroke.svg';
import { ReactComponent as TerminalIcon } from 'components/assets/Terminal.svg';
import { Container } from '@terra-money/apps/components';
import { useNavigate } from 'react-router';

type NewActionDialogProps = {};

export const NewActionDialog = (props: DialogProps<NewActionDialogProps>) => {
  const { closeDialog } = props;

  const openNewVariableDialog = useNewVariableDialog();
  const openNewJobDialog = useNewJobDialog();

  const navigate = useNavigate();

  return (
    <Dialog className={styles.root}>
      <DialogHeader title="New item" onClose={() => closeDialog(undefined)} />
      <DialogBody className={styles.body}>
        <Text variant="label" className={styles.description}>
          Select an option below to create an item.
        </Text>
        <Button variant="secondary" className={styles.btn} onClick={() => openNewJobDialog({})}>
          <Container direction="column" className={styles.txt_container}>
            <Text className={styles.text} variant="text">
              Job
            </Text>
            <Text className={styles.label} variant="label">
              Use jobs to automate your asynchronous on-chain logic.
            </Text>
          </Container>
          <JobsIcon className={styles.icon} />
        </Button>
        <Button
          variant="secondary"
          className={styles.btn}
          onClick={() => {
            navigate('/template-new/details');
            closeDialog();
          }}
        >
          <Container direction="column" className={styles.txt_container}>
            <Text className={styles.text} variant="text">
              Template
            </Text>
            <Text className={styles.label} variant="label">
              Use templates for structuring common use cases.
            </Text>
          </Container>
          <TerminalIcon className={styles.icon} />
        </Button>
        <Button variant="secondary" className={styles.btn} onClick={() => openNewVariableDialog({})}>
          <Container direction="column" className={styles.txt_container}>
            <Text className={styles.text} variant="text">
              Variable
            </Text>
            <Text className={styles.label} variant="label">
              Use variables to add dynamic behavior to job execution.
            </Text>
          </Container>
          <LightningStrokeIcon className={styles.icon} />
        </Button>
      </DialogBody>
    </Dialog>
  );
};

export const useNewActionDialog = () => {
  return useDialog<NewActionDialogProps>(NewActionDialog);
};
