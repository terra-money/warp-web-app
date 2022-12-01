import { UIElementProps } from '@terra-money/apps/components';
import { DropdownMenu } from 'components/dropdown-menu/DropdownMenu';
import { MenuAction } from 'components/menu-button/MenuAction';
import { Button } from 'components/primitives';
import React, { useEffect } from 'react';
import { createRef, forwardRef, useRef } from 'react';
import { warp_controller } from 'types';
import { ConcreteNode } from './ConcreteNode';

import styles from './ConditionNode.module.sass';
import { EmptyNode } from './EmptyNode';
import { Line } from './Line';

type OrNodeProps = UIElementProps & {
  parentRef: React.MutableRefObject<HTMLDivElement | null>;
  setCond: (cond: warp_controller.Condition) => void;
  conditions: warp_controller.Condition[];
};

export const OrNode = forwardRef((props: OrNodeProps, inputRef: React.Ref<HTMLButtonElement>) => {
  const { setCond, conditions, parentRef } = props;

  const itemsRef = useRef<React.MutableRefObject<HTMLButtonElement>[]>([]);
  const itemsCount = conditions.length + 1;

  if (itemsRef.current.length !== itemsCount) {
    itemsRef.current = Array(itemsCount)
      .fill(null)
      .map((_, i) => itemsRef.current[i] || createRef<HTMLButtonElement>());
  }

  const localRef = useRef<HTMLButtonElement>(null);
  const ref = (inputRef ?? localRef) as React.MutableRefObject<HTMLButtonElement>;

  const [, updateState] = React.useState<any>();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  useEffect(() => {
    forceUpdate();
  }, [conditions, forceUpdate]);

  return (
    <div className={styles.or_node}>
      <DropdownMenu
        className={styles.cond_btn}
        action={
          <Button className={styles.or_btn} ref={ref} variant="primary">
            Or
          </Button>
        }
      >
        <MenuAction onClick={() => setCond({ and: conditions })}>And</MenuAction>
        <MenuAction onClick={() => setCond({} as any)}>Delete</MenuAction>
      </DropdownMenu>
      <div className={styles.content}>
        {conditions.map((cond, idx) => (
          <ConcreteNode
            setCond={(cond) => {
              const conds = [...conditions];
              conds[idx] = cond;
              setCond({ or: conds });
            }}
            parentRef={parentRef}
            ref={itemsRef.current[idx]}
            key={idx}
            condition={cond}
          />
        ))}
        <EmptyNode
          setCond={(cond) => {
            setCond({ or: [...conditions, cond] });
          }}
          ref={itemsRef.current[itemsRef.current.length - 1]}
        />
      </div>
      {itemsRef.current.map((r, idx) => {
        return <Line key={idx} parent={parentRef} left={ref} right={r} />;
      })}
    </div>
  );
});
