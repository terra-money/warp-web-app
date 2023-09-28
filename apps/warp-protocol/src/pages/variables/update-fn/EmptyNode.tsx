import { UIElementProps } from '@terra-money/apps/components';
import classNames from 'classnames';
import { ReactComponent as Plus } from 'components/assets/Plus.svg';
import { forwardRef } from 'react';
import { Button } from 'components/primitives';
import styles from './UpdateFnNode.module.sass';
import { MenuAction } from 'components/menu-button/MenuAction';
import { DropdownMenu } from 'components/dropdown-menu/DropdownMenu';
import { warp_resolver } from '@terra-money/warp-sdk';

type EmptyNodeProps = UIElementProps & { setUpdateFn: (updateFn: warp_resolver.UpdateFnValue) => void };

export const EmptyNode = forwardRef((props: EmptyNodeProps, ref: React.Ref<HTMLButtonElement>) => {
  const { setUpdateFn } = props;

  const handleSelect = (type: string, subtype: string) => {
    const updateFn: warp_resolver.UpdateFnValue = {
      [type]:
        subtype === 'expr' ? { expr: { left: { simple: '' }, op: 'add', right: { simple: '' } } } : { simple: '' },
    } as any;

    setUpdateFn(updateFn);
  };

  return (
    <DropdownMenu
      menuClass={styles.menu}
      className={classNames(styles.node, styles.empty_node)}
      action={<Button ref={ref} icon={<Plus />} iconGap="none" />}
    >
      {['uint', 'int', 'decimal'].map((type) => (
        <DropdownMenu menuClass={styles.submenu} action={<MenuAction subMenu={true}>{type}</MenuAction>} key={type}>
          {['value', 'expr'].map((subtype) => (
            <MenuAction onClick={() => handleSelect(type, subtype)} key={subtype}>
              {subtype}
            </MenuAction>
          ))}
        </DropdownMenu>
      ))}
    </DropdownMenu>
  );
});
