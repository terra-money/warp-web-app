import { UIElementProps } from '@terra-money/apps/components';
import classNames from 'classnames';
import { ReactComponent as Plus } from 'components/assets/Plus.svg';
import { forwardRef } from 'react';
import { Button } from 'components/primitives';
import styles from './UpdateFnNode.module.sass';
import { MenuAction } from 'components/menu-button/MenuAction';
import { DropdownMenu } from 'components/dropdown-menu/DropdownMenu';
import { warp_resolver } from '@terra-money/warp-sdk';

type EmptyNodeProps = UIElementProps & {
  setUpdateFn: (updateFn: warp_resolver.UpdateFnValue) => void;
  kind: warp_resolver.VariableKind;
};

export const EmptyNode = forwardRef((props: EmptyNodeProps, ref: React.Ref<HTMLButtonElement>) => {
  const { setUpdateFn, kind } = props;

  return (
    <DropdownMenu
      menuClass={styles.menu}
      className={classNames(styles.node, styles.empty_node)}
      action={<Button ref={ref} icon={<Plus />} iconGap="none" />}
    >
      <MenuAction
        onClick={() => {
          setUpdateFn({ [kind]: { simple: '' } } as warp_resolver.UpdateFnValue);
        }}
        key="value"
      >
        Value
      </MenuAction>

      <MenuAction
        onClick={() => {
          setUpdateFn({
            [kind]: { expr: { left: { simple: '' }, op: 'add', right: { simple: '' } } },
          } as warp_resolver.UpdateFnValue);
        }}
        key="expr"
      >
        Expression
      </MenuAction>
    </DropdownMenu>
  );
});
