import { Container, UIElementProps } from '@terra-money/apps/components';
import classNames from 'classnames';
import { Text } from '../../../components/primitives';
import styles from './CurrentPosition.module.sass';
import { CurrentStakingPanel } from './CurrentStakingPanel';
import { CurrentPoolPanel } from './CurrentPoolPanel';

export type CurrentPositionProps = UIElementProps & {};

// TODO create queries for the data
export const CurrentPosition = (props: CurrentPositionProps) => {
  const { className } = props;

  return (
    <Container direction={'column'} className={classNames(styles.root, className)} gap={16}>
      <Text variant={'heading1'} className={styles.title}>
        Current Position
      </Text>

      <CurrentStakingPanel />
      <CurrentPoolPanel />
    </Container>
  );
};
