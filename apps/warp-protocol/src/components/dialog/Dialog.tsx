import classNames from 'classnames';
import { UIElementProps, Container } from '@terra-money/apps/components';
import styles from './Dialog.module.sass';

export const Dialog = (props: UIElementProps) => {
  const { className, children } = props;

  return (
    <Container className={classNames(className, styles.root)} direction="column">
      {children}
    </Container>
  );
};
