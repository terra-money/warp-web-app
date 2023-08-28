import { Container, UIElementProps } from '@terra-money/apps/components';
import { ConditionNode } from './condition-node/ConditionNode';
import { isEmpty } from 'lodash';

import styles from './ConditionBuilder.module.sass';
import { warp_resolver } from '@terra-money/warp-sdk';
import { Link } from 'components/primitives';

export type ConditionBuilderProps = UIElementProps & {
  cond?: warp_resolver.Condition;
  setCond: (cond?: warp_resolver.Condition) => void;
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
