import { ClickAwayListener, Portal } from '@mui/material';
import { UIElementProps } from '@terra-money/apps/components';
import classNames from 'classnames';
import { MenuContext, MenuProvider } from 'components/menu-button';
import { Menu } from 'components/menu/Menu';
import { cloneElement, CSSProperties, useContext, useEffect, useMemo, useRef, useState } from 'react';
import styles from './DropdownMenu.module.sass';

export type DropdownMenuProps = UIElementProps & {
  action?: JSX.Element;
  menuClass?: string;
  open?: boolean;
  menuStyle?: React.CSSProperties;
};

export function DropdownMenuInner(props: DropdownMenuProps) {
  const { className, children, action, menuClass, menuStyle, open, style } = props;
  const { open: dropdownOpen, setOpen: setDropdownOpen } = useContext(MenuContext);
  const containerRef = useRef<HTMLDivElement>(null);

  const [menuEl, setMenuEl] = useState<HTMLElement | null>(null);
  const menuHeight = useMemo(() => menuEl?.clientHeight ?? 0, [menuEl]);

  const containerTop = containerRef.current?.getBoundingClientRect().top ?? 0;
  const containerLeft = containerRef.current?.getBoundingClientRect().left ?? 0;

  const coords: CSSProperties = {
    top: containerTop + 52,
    left: containerLeft,
  };

  const outOfViewport = (menuEl?.getBoundingClientRect().bottom ?? 0) > window.innerHeight;

  if (outOfViewport) {
    const padding = 8;
    coords.top = containerTop - (menuHeight + padding);
  }

  useEffect(() => {
    setDropdownOpen(Boolean(open));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <ClickAwayListener
      onClickAway={() => {
        setDropdownOpen(false);
      }}
    >
      <div className={classNames(styles.root, className)} ref={containerRef} style={style}>
        {action &&
          cloneElement(action, {
            onClick: () => {
              setDropdownOpen((open) => !open);
              action.props.onClick?.();
            },
          })}
        {dropdownOpen && (
          <Portal>
            <Menu
              className={classNames(styles.menu, menuClass)}
              style={{ ...coords, ...menuStyle }}
              ref={(el) => setMenuEl(el)}
            >
              {children}
            </Menu>
          </Portal>
        )}
      </div>
    </ClickAwayListener>
  );
}

export const DropdownMenu = (props: DropdownMenuProps) => {
  return (
    <MenuProvider>
      <DropdownMenuInner {...props} />
    </MenuProvider>
  );
};
