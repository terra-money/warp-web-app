import { Modal } from '@mui/material';
import classNames from 'classnames';
import { ReactNode } from 'react';
import { useDialogContext } from './DialogProvider';
import styles from './Dialog.module.sass';

interface DialogProps {
  index: number;
  closeDialog: (returnValue: any) => void;
  children: ReactNode;
  noBackgroundClick?: boolean;
}

export const Dialog = (props: DialogProps) => {
  const { index, closeDialog, children, noBackgroundClick } = props;

  const { dialogs } = useDialogContext();

  const handleClose = (event: React.MouseEvent<HTMLDivElement>, reason: string) => {
    if (reason !== 'backdropClick') {
      closeDialog(undefined);
    }
  }

  return (
    <Modal
      className={styles.root}
      open={true}
      hideBackdrop={index > 0}
      onClose={noBackgroundClick ? handleClose : () => closeDialog(undefined)}
      disableEnforceFocus={noBackgroundClick && true}
      disableEscapeKeyDown={noBackgroundClick && true}
    >
      <div
        className={classNames(styles.content, {
          [styles.hide]: index < dialogs.length - 1,
        })}
      >
        {children}
      </div>
    </Modal>
  );
};
