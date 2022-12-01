import { UIElementProps } from '@terra-money/apps/components';
import { MenuItem } from 'components/menu/Menu';
import { useContext } from 'react';
import { MenuContext } from './MenuContext';

export type MenuActionProps = UIElementProps & { onClick?: () => void; subMenu?: boolean };

export const MenuAction = (props: MenuActionProps) => {
  const { setOpen } = useContext(MenuContext);
  const { onClick, children, subMenu, className } = props;

  return (
    <MenuItem
      subMenu={subMenu}
      className={className}
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
