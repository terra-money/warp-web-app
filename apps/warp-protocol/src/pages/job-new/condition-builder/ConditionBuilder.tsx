import { Container, UIElementProps } from '@terra-money/apps/components';
import { ConditionNode } from './condition-node/ConditionNode';

import styles from './ConditionBuilder.module.sass';
import { warp_controller } from 'types';

export type ConditionBuilderProps = UIElementProps & {
  cond?: warp_controller.Condition;
  setCond: (cond: warp_controller.Condition) => void;
};

export const ConditionBuilder = (props: ConditionBuilderProps) => {
  const { cond, setCond } = props;

  return (
    <Container className={styles.root}>
      <ConditionNode cond={cond} setCond={setCond} />
    </Container>
  );
};
