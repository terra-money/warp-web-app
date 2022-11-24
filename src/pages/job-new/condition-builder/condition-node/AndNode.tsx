import { UIElementProps } from 'shared/components';
import { Button } from 'components/primitives';
import React, { useEffect } from 'react';
import { createRef, forwardRef, useRef } from 'react';
import { warp_controller } from 'types';
import { Line } from './Line';

import styles from './ConditionNode.module.sass';
import { ConcreteNode } from './ConcreteNode';
import { EmptyNode } from './EmptyNode';
import { MenuAction } from 'components/menu-button/MenuAction';
import { DropdownMenu } from 'components/dropdown-menu/DropdownMenu';

type AndNodeProps = UIElementProps & {
  parentRef: React.MutableRefObject<HTMLDivElement | null>;
  setCond: (cond: warp_controller.Condition) => void;
  conditions: warp_controller.Condition[];
};

export const AndNode = forwardRef((props: AndNodeProps, inputRef: React.Ref<HTMLButtonElement>) => {
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
    <div className={styles.and_node}>
      <DropdownMenu
        className={styles.cond_btn}
        action={
          <Button className={styles.and_btn} ref={ref} variant="primary">
            And
          </Button>
        }
      >
        <MenuAction onClick={() => setCond({ or: conditions })}>Or</MenuAction>
        <MenuAction onClick={() => setCond({} as any)}>Delete</MenuAction>
      </DropdownMenu>
      <div className={styles.content}>
        {conditions.map((cond, idx) => (
          <ConcreteNode
            setCond={(cond) => {
              const conds = [...conditions];
              conds[idx] = cond;
              setCond({ and: conds });
            }}
            parentRef={parentRef}
            ref={itemsRef.current[idx]}
            key={idx}
            condition={cond}
          />
        ))}
        <EmptyNode
          setCond={(cond) => {
            setCond({ and: [...conditions, cond] });
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
