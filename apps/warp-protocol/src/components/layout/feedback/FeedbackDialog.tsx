import { Button, Text } from 'components/primitives';
import { useDialog, DialogProps } from '@terra-money/apps/hooks';
import { Dialog, DialogBody, DialogHeader } from 'components/dialog';
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
          At Warp Protocol, your feedback is crucial for product enhancement and shaping future innovations. Whether you
          have insights on our existing features or are interested in discussing potential integrations, we're eager to
          collaborate and explore new possibilities together.
        </Text>

        <Button
          variant="secondary"
          className={styles.btn}
          onClick={async () => {
            window.open('https://terra.sc/warpfeedback');
            closeDialog(undefined);
          }}
        >
          <Text variant="text">Feedback</Text>
          <ArrowLinkIcon />
        </Button>
        <Button
          variant="secondary"
          className={styles.btn}
          onClick={async () => {
            window.open('https://forms.gle/AVfrfDStd95qjnGQ9');
            closeDialog(undefined);
          }}
        >
          <Text variant="text">Partnerships</Text>
          <ArrowLinkIcon />
        </Button>
      </DialogBody>
    </Dialog>
  );
};

export const useFeedbackDialog = () => {
  return useDialog<FeedbackDialogProps, boolean>(FeedbackDialog);
};
