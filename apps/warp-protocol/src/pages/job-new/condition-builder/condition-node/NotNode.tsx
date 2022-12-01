import { UIElementProps } from '@terra-money/apps/components';
import { Button } from 'components/primitives';
import React, { useEffect, useRef } from 'react';
import { forwardRef } from 'react';
import { warp_controller } from 'types';
import { isEmpty } from 'lodash';
import { ConcreteNode } from './ConcreteNode';

import styles from './ConditionNode.module.sass';
import { Line } from './Line';
import { EmptyNode } from './EmptyNode';
import { MenuAction } from 'components/menu-button/MenuAction';
import { DropdownMenu } from 'components/dropdown-menu/DropdownMenu';

type NotNodeProps = UIElementProps & {
  parentRef: React.MutableRefObject<HTMLDivElement | null>;
  setCond: (cond: warp_controller.Condition) => void;
  condition: warp_controller.Condition;
};

export const NotNode = forwardRef((props: NotNodeProps, inputRef: React.Ref<HTMLButtonElement>) => {
  const { setCond, condition, parentRef } = props;

  const condRef = useRef<HTMLButtonElement>(null);

  const localRef = useRef<HTMLButtonElement>(null);
  const ref = (inputRef ?? localRef) as React.MutableRefObject<HTMLButtonElement>;

  const [, updateState] = React.useState<any>();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  useEffect(() => {
    forceUpdate();
  }, [condition, forceUpdate]);

  return (
    <div className={styles.not_node}>
      <DropdownMenu
        className={styles.cond_btn}
        action={
          <Button className={styles.not_btn} ref={ref} variant="primary">
            Not
          </Button>
        }
      >
        <MenuAction onClick={() => setCond({} as any)}>Delete</MenuAction>
      </DropdownMenu>
      {isEmpty(condition) ? (
        <EmptyNode setCond={(cond) => setCond({ not: cond })} ref={condRef} />
      ) : (
        <ConcreteNode
          setCond={(cond) => setCond({ not: cond })}
          parentRef={parentRef}
          ref={condRef}
          condition={condition}
        />
      )}
      <Line parent={parentRef} left={ref} right={condRef as React.MutableRefObject<HTMLButtonElement>} />
    </div>
  );
});
