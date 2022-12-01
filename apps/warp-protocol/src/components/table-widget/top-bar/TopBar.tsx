import { Container, UIElementProps } from '@terra-money/apps/components';
import classNames from 'classnames';

import styles from './TopBar.module.sass';

type TopBarProps = UIElementProps;

export const TopBar = (props: TopBarProps) => {
  const { children, className } = props;

  return (
    <Container className={classNames(styles.top_bar, className)} direction="row">
      {children}
    </Container>
  );
};
