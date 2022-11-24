import { Link, Text } from 'components/primitives';
import { ReactComponent as CloseIcon } from 'components/assets/Close.svg';
import classNames from 'classnames';
import { Container, UIElementProps } from 'shared/components';
import styles from './DialogHeader.module.sass';
import { useDialogContext } from 'shared/dialog';

interface DialogHeaderProps extends UIElementProps {
  title: string;
  onClose: () => void;
}

export const DialogHeader = (props: DialogHeaderProps) => {
  const { className, title, children, onClose } = props;

  const { dialogs, popDialog } = useDialogContext();

  return (
    <Container className={classNames(className, styles.root)} direction="column">
      {dialogs.length > 1 && (
        <Link className={styles.back} onClick={popDialog}>
          Back
        </Link>
      )}
      <div className={styles.close} onClick={onClose}>
        <CloseIcon className={styles.close_icon} />
      </div>
      <Text className={styles.title} variant="heading1">
        {title}
      </Text>
      {children && <div className={styles.children}>{children}</div>}
    </Container>
  );
};
