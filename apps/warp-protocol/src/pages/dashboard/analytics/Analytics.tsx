import styles from './Analytics.module.sass';
import { Container, UIElementProps } from '@terra-money/apps/components';
import { Charts } from './charts/Charts';
import classNames from 'classnames';
import { useChainSelector } from '@terra-money/apps/hooks';

export const Analytics = (props: UIElementProps) => {
  const { className } = props;

  const { selectedChain } = useChainSelector();

  return (
    <Container direction="column" className={classNames(styles.root, className)}>
      <Charts />
      {selectedChain.name === 'injective' && <div className={styles.overlay}>Coming Soon</div>}
    </Container>
  );
};
