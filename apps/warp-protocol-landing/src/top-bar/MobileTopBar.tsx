import { Container, UIElementProps } from '@terra-money/apps/components';

import styles from './MobileTopBar.module.sass';
import { Button } from '../button/Button';
import { ReactComponent as TwitterIcon } from '../assets/Twitter.svg';
import { ReactComponent as TelegramIcon } from '../assets/Telegram.svg';
import { ReactComponent as DiscordIcon } from '../assets/Discord.svg';
import { ReactComponent as Menu } from '../assets/Menu.svg';
import classNames from 'classnames';
import { forwardRef } from 'react';
import { Drawer } from '@mui/material';
import { Text } from 'text';

type MobileTopBarProps = UIElementProps & {
  onHomeClick: () => void;
  onDocsClick: () => void;
  onFeaturesClick: () => void;
  onDiscordClick: () => void;
  onWebAppClick: () => void;
  onTelegramClick: () => void;
  onTwitterClick: () => void;
  onToggleDrawer: () => void;
  onSdkClick: () => void;
  onGetInTouchClick: () => void;
  drawerOpen: boolean;
};

export const MobileTopBar = forwardRef<
  HTMLDivElement | null,
  MobileTopBarProps
>((props, ref) => {
  const {
    onHomeClick,
    onDocsClick,
    onFeaturesClick,
    onDiscordClick,
    onWebAppClick,
    onTelegramClick,
    onTwitterClick,
    onToggleDrawer,
    onGetInTouchClick,
    onSdkClick,
    drawerOpen,
  } = props;

  return (
    <div className={styles.mobile_root}>
      <Container direction="row" className={styles.container}>
        <Container direction="row" className={styles.left}>
          <div className={styles.logo}>warp.</div>
        </Container>
        <Button
          className={styles.menu_btn}
          icon={<Menu />}
          fill="none"
          iconGap="none"
          onClick={onToggleDrawer}
        />
        <Drawer
          anchor="right"
          open={drawerOpen}
          classes={{
            paper: styles.drawer,
          }}
          onClose={onToggleDrawer}
        >
          <Container direction="row" className={styles.top}>
            <Button
              className={styles.menu_btn_inner}
              icon={<Menu />}
              fill="none"
              iconGap="none"
              onClick={onToggleDrawer}
            />
          </Container>
          <Container direction="column" className={styles.middle}>
            <Text
              variant="label"
              className={classNames(styles.label, styles.menu_label)}
            >
              Menu
            </Text>
            <Text
              variant="heading2"
              onClick={onHomeClick}
              className={styles.menu_heading}
            >
              Home
            </Text>
            <Text
              variant="heading2"
              onClick={onFeaturesClick}
              className={styles.menu_heading}
            >
              Features
            </Text>
            <Text
              variant="heading2"
              onClick={onSdkClick}
              className={styles.menu_heading}
            >
              SDK
            </Text>
            <Text
              variant="heading2"
              onClick={onDocsClick}
              className={styles.menu_heading}
            >
              Docs
            </Text>
            <Text
              variant="heading2"
              onClick={onWebAppClick}
              className={styles.menu_heading}
            >
              App
            </Text>
            <Text
              variant="heading2"
              onClick={onGetInTouchClick}
              className={styles.menu_heading}
            >
              Get in Touch
            </Text>
          </Container>
          <Container className={styles.bottom} direction="column">
            <Text
              variant="label"
              className={classNames(styles.label, styles.social_media_label)}
            >
              Social media
            </Text>
            <Container direction="row" className={styles.right}>
              <Button
                className={styles.button}
                variant="secondary"
                gutters="none"
                icon={<DiscordIcon />}
                fill="none"
                iconGap="small"
                onClick={onDiscordClick}
              />
              <Button
                className={styles.button}
                variant="secondary"
                gutters="none"
                icon={<TelegramIcon />}
                fill="none"
                iconGap="small"
                onClick={onTelegramClick}
              />
              <Button
                className={styles.button}
                variant="secondary"
                gutters="none"
                icon={<TwitterIcon />}
                fill="none"
                iconGap="small"
                onClick={onTwitterClick}
              />
            </Container>
          </Container>
        </Drawer>
      </Container>
    </div>
  );
});
