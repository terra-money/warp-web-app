import { UIElementProps } from '@terra-money/apps/components';
import { isEmpty } from 'lodash';
import { ConcreteNode } from './ConcreteNode';
import { EmptyNode } from './EmptyNode';

import styles from './UpdateFnNode.module.sass';
import { useRef } from 'react';
import { warp_resolver } from '@terra-money/warp-sdk';

export type UpdateFnNodeProps = UIElementProps & {
  kind: warp_resolver.VariableKind;
  updateFn?: warp_resolver.UpdateFnValue;
  setUpdateFn: (updateFn: warp_resolver.UpdateFnValue) => void;
};

export const UpdateFnNode = (props: UpdateFnNodeProps) => {
  const { updateFn, setUpdateFn, kind } = props;

  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.root} ref={ref}>
      {!isEmpty(updateFn) ? (
        <ConcreteNode updateFn={updateFn} setUpdateFn={setUpdateFn} />
      ) : (
        <EmptyNode setUpdateFn={setUpdateFn} kind={kind} />
      )}
    </div>
  );
};
