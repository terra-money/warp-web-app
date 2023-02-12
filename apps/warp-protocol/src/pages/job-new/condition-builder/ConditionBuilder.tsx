import { Container, UIElementProps } from '@terra-money/apps/components';
import { ConditionNode } from './condition-node/ConditionNode';
import { isEmpty } from 'lodash';

import styles from './ConditionBuilder.module.sass';
import { warp_controller } from 'types';
import { Link } from 'components/primitives';

export type ConditionBuilderProps = UIElementProps & {
  cond?: warp_controller.Condition;
  setCond: (cond?: warp_controller.Condition) => void;
};

export const ConditionBuilder = (props: ConditionBuilderProps) => {
  const { cond, setCond } = props;

  return (
    <Container className={styles.root} direction="column">
      {!isEmpty(cond) && (
        <Link className={styles.back} onClick={() => setCond({} as any)}>
          Clear all
        </Link>
      )}
      <ConditionNode cond={cond} setCond={setCond} />
    </Container>
  );
};
