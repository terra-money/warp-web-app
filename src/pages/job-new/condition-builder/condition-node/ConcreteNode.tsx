import { UIElementProps } from 'shared/components';
import { forwardRef, useRef } from 'react';
import { warp_controller } from 'types';
import { AndNode } from './AndNode';

import styles from './ConditionNode.module.sass';
import { ExprNode } from './ExprNode';
import { NotNode } from './NotNode';
import { OrNode } from './OrNode';

type ConcreteNodeProps = UIElementProps & {
  setCond: (cond: warp_controller.Condition) => void;
  condition?: warp_controller.Condition;
  parentRef: React.MutableRefObject<HTMLDivElement | null>;
};

export const ConcreteNode = forwardRef((props: ConcreteNodeProps, inputRef?: React.Ref<HTMLButtonElement>) => {
  const { setCond, condition = {} as warp_controller.Condition, parentRef } = props;
  let node = null;

  let btnRef = useRef<HTMLButtonElement>(null);
  let ref = inputRef ?? btnRef;

  node = null;

  if ('expr' in condition && condition.expr) {
    node = <ExprNode setCond={setCond} ref={ref as React.Ref<HTMLDivElement>} expr={condition.expr} />;
  }

  if ('and' in condition && condition.and) {
    node = <AndNode setCond={setCond} parentRef={parentRef} ref={ref} conditions={condition.and} />;
  }

  if ('or' in condition && condition.or) {
    node = <OrNode setCond={setCond} parentRef={parentRef} ref={ref} conditions={condition.or} />;
  }

  if ('not' in condition && condition.not) {
    node = <NotNode setCond={setCond} parentRef={parentRef} ref={ref} condition={condition.not} />;
  }

  return node ? <div className={styles.node}>{node}</div> : null;
});
