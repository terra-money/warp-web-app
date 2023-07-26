import { Button, Text } from 'components/primitives';
import { useDialog, DialogProps } from '@terra-money/apps/hooks';
import { Dialog, DialogBody, DialogFooter, DialogHeader } from 'components/dialog';
import { ReactComponent as ArrowLinkIcon } from 'components/assets/ArrowLink.svg';
import { ReactComponent as TwitterIcon } from 'components/assets/Twitter.svg';
import styles from './ReadOnlyWarningDialog.module.sass';

type ReadOnlyWarningDialogProps = {};

export const ReadOnlyWarningDialog = (props: DialogProps<ReadOnlyWarningDialogProps, boolean>) => {
  const { closeDialog } = props;

  return (
    <Dialog className={styles.root}>
      <DialogHeader title="Limited support" onClose={() => closeDialog(undefined)} />
      <DialogBody className={styles.body}>
        <Text variant="label" className={styles.description}>
          Warp Protocol web app now supports data preview only. We're actively working on our upcoming release, which
          will unlock the full range of features. Follow us on Twitter for updates!
        </Text>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="secondary"
          className={styles.btn}
          icon={<TwitterIcon />}
          iconAlignment="start"
          iconGap="large"
          onClick={async () => {
            window.open('https://twitter.com/warp_protocol');
            closeDialog(undefined);
          }}
        >
          <Text variant="text" className={styles.text}>
            Twitter
          </Text>
          <ArrowLinkIcon className={styles.arrow} />
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export const useReadOnlyWarningDialog = () => {
  return useDialog<ReadOnlyWarningDialogProps, boolean>(ReadOnlyWarningDialog);
};
