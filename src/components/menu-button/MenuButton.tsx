import classNames from 'classnames';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useContext, useRef, useState } from 'react';
import { ClickAwayListener, Portal } from '@mui/material';
import { Menu } from 'components/menu/Menu';
import { ActionButton } from 'components/action-button/ActionButton';
import styles from './MenuButton.module.sass';
import { UIElementProps } from 'shared/components';
import { MenuContext, MenuProvider } from './MenuContext';

export type MenuButtonProps = UIElementProps & {};

const MenuButtonInner = (props: MenuButtonProps) => {
  const { className, children } = props;
  const [menuHeight, setMenuHeight] = useState(200);
  const { open, setOpen } = useContext(MenuContext);
  const actionContainer = useRef<HTMLDivElement>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  const clipToViewportHeight = (top: number) => {
    const offset = menuHeight + 40;

    if (top + offset > window.innerHeight) {
      return window.innerHeight - offset;
    }

    return top;
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div className={classNames(styles.root, className)} ref={actionContainer}>
        <ActionButton
          className={classNames(styles.action_btn, {
            [styles.btn_active]: open,
          })}
          variant="primary"
          fill="none"
          icon={<MoreVertIcon />}
          iconGap="none"
          onClick={() => setOpen((open) => !open)}
        />
        {open && (
          <Portal>
            <Menu
              ref={(element) => {
                setMenuHeight(element?.clientHeight ?? 200);
                return menuRef;
              }}
              style={{
                top: clipToViewportHeight(actionContainer.current?.getBoundingClientRect().top ?? 0),
                left: (actionContainer.current?.getBoundingClientRect().left ?? 0) - 210,
                bottom: 'auto',
              }}
            >
              {children}
            </Menu>
          </Portal>
        )}
      </div>
    </ClickAwayListener>
  );
};

export const MenuButton = (props: MenuButtonProps) => {
  return (
    <MenuProvider>
      <MenuButtonInner {...props} />
    </MenuProvider>
  );
};
