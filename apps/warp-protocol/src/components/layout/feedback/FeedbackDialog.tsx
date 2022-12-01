import { Button, Text } from 'components/primitives';
import { useDialog, DialogProps } from '@terra-money/apps/hooks';
import { Dialog, DialogBody, DialogFooter, DialogHeader } from 'components/dialog';
import { ReactComponent as ArrowLinkIcon } from 'components/assets/ArrowLink.svg';
import styles from './FeedbackDialog.module.sass';

type FeedbackDialogProps = {};

export const FeedbackDialog = (props: DialogProps<FeedbackDialogProps, boolean>) => {
  const { closeDialog } = props;

  return (
    <Dialog className={styles.root}>
      <DialogHeader title="We'd love to hear from you!" onClose={() => closeDialog(undefined)} />
      <DialogBody className={styles.body}>
        <Text variant="label" className={styles.description}>
          We want to keep improving Warp Protocol for our community. Share your thoughts about existing features and
          ideas for the future by clicking a button below.
        </Text>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="secondary"
          className={styles.btn}
          onClick={async () => {
            window.open('https://terra.sc/warpfeedback');
            closeDialog(undefined);
          }}
        >
          <Text variant="text">Feedback form</Text>
          <ArrowLinkIcon />
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export const useFeedbackDialog = () => {
  return useDialog<FeedbackDialogProps, boolean>(FeedbackDialog);
};
