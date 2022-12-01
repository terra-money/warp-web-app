import { Container, UIElementProps } from '@terra-money/apps/components';
import classNames from 'classnames';

import styles from './Actions.module.sass';

type ActionsProps = UIElementProps;

export const Actions = (props: ActionsProps) => {
  const { children, className } = props;

  return (
    <Container className={classNames(styles.actions, className)} direction="row">
      {children}
    </Container>
  );
};
