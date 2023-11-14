import { useState } from 'react';
import { Checkbox } from '@mui/material';
import { Button, Link, Text } from 'components/primitives';
import { useDialog, DialogProps } from '@terra-money/apps/hooks';
import { Container } from '@terra-money/apps/components';
import { Dialog, DialogBody, DialogFooter, DialogHeader } from 'components/dialog';
import styles from './TermsOfUseDialog.module.sass';

type TermsOfUseDialogProps = {
  noBackgroundClick?: boolean;
};

export const TermsOfUseDialog = (props: DialogProps<TermsOfUseDialogProps, boolean>) => {
  const { closeDialog } = props;
  const [checked, setChecked] = useState(false);

  const handleAccept = () => {
    localStorage.setItem('TermsOfUseAccepted_Oct-3-2023', 'true');
    closeDialog(true, { closeAll: true });
  };

  return (
    <Dialog className={styles.content}>
      <DialogHeader title="Terms of Use" onClose={() => {}} hideCloseIcon={true} />
      <DialogBody>
        <Container component="p" className={styles.container__override}>
          <Text className={styles.text__override} variant={'text'}>
            Please check the box below to confirm your agreement to the{' '}
          </Text>
          <Link
            onClick={() => {
              window.open('https://drive.google.com/file/d/1A4B41Cy2lR0nQnlAVLGgjNcFParcbnA_/view?usp=drive_link');
            }}
            className={styles.link}
          >
            Terms of Use
          </Link>
          <Text className={styles.text__override} variant={'text'}>
            {' '}
            and{' '}
          </Text>
          <Link
            onClick={() => {
              window.open(
                'https://assets.website-files.com/611153e7af981472d8da199c/631ac874c79cf645a2f9b5ee_PrivacyPolicy.pdf'
              );
            }}
            className={styles.link}
          >
            Privacy Policy
          </Link>
        </Container>
        <Container gap={8}>
          <Checkbox
            checked={checked}
            onChange={() => setChecked(!checked)}
            name="Confirm"
            classes={{
              root: styles.checkbox__override,
            }}
          />
          <Text className={styles.text__override} variant={'text'}>
            I have read and understand, and do hereby agree to be bound by the Terms of Use and Privacy Policy,
            including all future amendments thereto.
          </Text>
        </Container>
      </DialogBody>
      <DialogFooter>
        <Button disabled={!checked} variant="primary" onClick={handleAccept}>
          Accept & Continue
        </Button>
        <Button variant="secondary" onClick={() => (window.location.href = 'https://warp.money/home')}>
          Reject & Exit
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export const useTermsOfUseDialog = () => {
  return useDialog<TermsOfUseDialogProps, boolean>(TermsOfUseDialog);
};
