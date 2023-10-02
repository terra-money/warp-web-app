import { Container, UIElementProps } from '@terra-money/apps/components';

import styles from './DesktopTopBar.module.sass';
import { Button } from '../button/Button';
import classNames from 'classnames';
import { forwardRef } from 'react';
import { DropdownMenu } from 'dropdown-menu/DropdownMenu';
import { MenuAction } from 'menu-button/MenuAction';

type DesktopTopBarProps = UIElementProps & {
  onHomeClick: () => void;
  onDocsClick: () => void;
  onFeaturesClick: () => void;
  onWebAppClick: () => void;
  onTelegramClick: () => void;
  onDiscordClick: () => void;
};

export const DesktopTopBar = forwardRef<
  HTMLDivElement | null,
  DesktopTopBarProps
>((props, ref) => {
  const {
    onHomeClick,
    onFeaturesClick,
    onDocsClick,
    onWebAppClick,
    onTelegramClick,
    onDiscordClick,
  } = props;

  return (
    <div className={styles.root} ref={ref}>
      <Container direction="row" className={styles.left}>
        <div className={styles.logo} onClick={onHomeClick}>
          warp.
        </div>
      </Container>
      <Container direction="row" className={styles.right}>
        <Button
          className={classNames(styles.button, styles.btn_gray)}
          variant="primary"
          fill="none"
          onClick={onHomeClick}
        >
          Home
        </Button>
        <Button
          className={classNames(styles.button, styles.btn_gray)}
          variant="primary"
          fill="none"
          onClick={onDocsClick}
        >
          Docs
        </Button>
        <Button
          className={classNames(styles.button, styles.btn_gray)}
          variant="primary"
          fill="none"
          onClick={onFeaturesClick}
        >
          Features
        </Button>
        <DropdownMenu
          menuClass={styles.menu}
          className={styles.btn_gray}
          action={
            <Button
              className={classNames(styles.button, styles.btn_gray)}
              variant="primary"
              fill="none"
            >
              Community
            </Button>
          }
        >
          <MenuAction onClick={onTelegramClick}>Telegram</MenuAction>
          <MenuAction onClick={onDiscordClick}>Discord</MenuAction>
        </DropdownMenu>
        <Button
          className={classNames(styles.button, styles.btn_gray)}
          variant="primary"
          fill="none"
          onClick={onWebAppClick}
        >
          App
        </Button>
      </Container>
    </div>
  );
});
