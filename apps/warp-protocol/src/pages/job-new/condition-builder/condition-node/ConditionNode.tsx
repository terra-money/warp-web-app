import { UIElementProps } from '@terra-money/apps/components';
import { warp_controller } from 'types';
import { isEmpty } from 'lodash';
import { ConcreteNode } from './ConcreteNode';
import { EmptyNode } from './EmptyNode';

import styles from './ConditionNode.module.sass';
import { useRef } from 'react';

export type ConditionNodeProps = UIElementProps & {
  cond?: warp_controller.Condition;
  setCond: (cond: warp_controller.Condition) => void;
};

export const ConditionNode = (props: ConditionNodeProps) => {
  const { cond, setCond } = props;

  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.root} ref={ref}>
      {!isEmpty(cond) ? (
        <ConcreteNode condition={cond} parentRef={ref} setCond={setCond} />
      ) : (
        <EmptyNode setCond={setCond} />
      )}
    </div>
  );
};
