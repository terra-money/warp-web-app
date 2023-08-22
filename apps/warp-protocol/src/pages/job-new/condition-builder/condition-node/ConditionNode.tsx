import { UIElementProps } from '@terra-money/apps/components';
import { isEmpty } from 'lodash';
import { ConcreteNode } from './ConcreteNode';
import { EmptyNode } from './EmptyNode';

import styles from './ConditionNode.module.sass';
import { useRef } from 'react';
import { warp_resolver } from '@terra-money/warp-sdk';

export type ConditionNodeProps = UIElementProps & {
  cond?: warp_resolver.Condition;
  setCond: (cond: warp_resolver.Condition) => void;
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
