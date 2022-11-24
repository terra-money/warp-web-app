import styles from './Analytics.module.sass';
import { Container, UIElementProps } from 'shared/components';
import { Charts } from './charts/Charts';
import classNames from 'classnames';

export const Analytics = (props: UIElementProps) => {
  const { className } = props;

  return (
    <Container direction="column" className={classNames(styles.root, className)}>
      <Charts />
    </Container>
  );
};
