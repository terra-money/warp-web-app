import { UIElementProps } from 'shared/components';
import classNames from 'classnames';
import { forwardRef, Ref } from 'react';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import styles from './Menu.module.sass';

export const Menu = forwardRef((props: UIElementProps, ref: Ref<HTMLDivElement>) => {
  const { children, style, className } = props;

  return (
    <div className={classNames(styles.menu, className)} style={style} ref={ref}>
      <div className={styles.menu_content}>{children}</div>
    </div>
  );
});

type MenuItemProps = UIElementProps & { onClick?: () => void; subMenu?: boolean };

export const MenuItem = (props: MenuItemProps) => {
  const { children, subMenu, ...remainingProps } = props;

  return (
    <div {...remainingProps} className={classNames(styles.menu_item, subMenu && styles.submenu, props.className)}>
      {children}
      {subMenu && <KeyboardArrowRightIcon className={styles.chevron} />}
    </div>
  );
};
