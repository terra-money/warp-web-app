import { Container, UIElementProps } from 'shared/components';
import styles from './Staking.module.sass';
import { Text } from '../../components/primitives';
import { Analytics } from './analytics/Analytics';
import { CurrentPosition } from './current-position/CurrentPosition';

export type StakingProps = UIElementProps & {};

export function Staking(props: StakingProps) {
  return (
    <Container direction="column" className={styles.root}>
      <Text variant="heading1" className={styles.title}>
        Staking
      </Text>
      <Analytics className={styles.analytics} />
      <CurrentPosition className={styles.current_position} />
    </Container>
  );
}
