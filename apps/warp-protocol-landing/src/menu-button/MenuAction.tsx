import { UIElementProps } from '@terra-money/apps/components';
import { MenuItem } from '../menu';
import { useContext } from 'react';
import { MenuContext } from './MenuContext';

export type MenuActionProps = UIElementProps & { onClick?: () => void; subMenu?: boolean; onMouseEnter?: () => void };

export const MenuAction = (props: MenuActionProps) => {
  const { setOpen } = useContext(MenuContext);
  const { onClick, children, subMenu, className, onMouseEnter } = props;

  return (
    <MenuItem
      subMenu={subMenu}
      className={className}
      onMouseEnter={onMouseEnter}
      onClick={() => {
        if (!subMenu) {
          setOpen(false);
        }

        onClick?.();
      }}
    >
      {children}
    </MenuItem>
  );
};
