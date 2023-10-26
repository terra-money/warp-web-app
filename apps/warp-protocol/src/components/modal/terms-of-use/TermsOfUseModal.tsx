import { useState } from 'react';
import { Checkbox, Modal } from '@mui/material';
import { Container } from '@terra-money/apps/components';
import { Button, Text } from 'components/primitives';
import { DialogBody, DialogFooter, DialogHeader } from 'components/dialog';
import styles from './TermsOfUseModal.module.sass';

export const TermsOfUseModal = () => {
  const [checked, setChecked] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const hasAcceptedCurrent = localStorage.getItem('TermsOfUseAccepted_Oct-3-2023');

  const handleClose = (event: React.MouseEvent<HTMLDivElement>, reason: string) => {
    if (reason !== 'backdropClick') {
      setIsOpen(false);
    }
  };

  const handleAccept = () => {
    localStorage.setItem('TermsOfUseAccepted_Oct-3-2023', 'true');
    setIsOpen(false);
  };

  if (hasAcceptedCurrent === 'true') return null;

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      classes={{ root: styles.modal__root }}
      disableEnforceFocus={true}
      disableEscapeKeyDown={true}
    >
      <div className={styles.content}>
        <DialogHeader title="Terms of Use" onClose={() => {}} hideCloseIcon={true} />
        <DialogBody>
          <Container component="p" className={styles.container__override}>
            <Text className={styles.text__override} variant={'text'}>
              Please check the box below to confirm your agreement to the{' '}
            </Text>
            <a
              href="https://drive.google.com/file/d/1A4B41Cy2lR0nQnlAVLGgjNcFParcbnA_/view?usp=drive_link"
              target="_blank"
              rel="noreferrer"
              className={styles.link}
            >
              <Text variant={'link'} weight="bold">
                Terms of Use
              </Text>
            </a>
            <Text className={styles.text__override} variant={'text'}>
              {' '}
              and{' '}
            </Text>
            <a
              href="https://assets.website-files.com/611153e7af981472d8da199c/631ac874c79cf645a2f9b5ee_PrivacyPolicy.pdf"
              target="_blank"
              rel="noreferrer"
              className={styles.link}
            >
              <Text variant={'link'} weight="bold">
                Privacy Policy
              </Text>
            </a>
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
      </div>
    </Modal>
  );
};
