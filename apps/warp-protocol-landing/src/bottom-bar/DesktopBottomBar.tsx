import { Container, UIElementProps } from '@terra-money/apps/components';
import { ReactComponent as TwitterIcon } from '../assets/Twitter.svg';
import { ReactComponent as TelegramIcon } from '../assets/Telegram.svg';
import { ReactComponent as DiscordIcon } from '../assets/Discord.svg';

import styles from './DesktopBottomBar.module.sass';
import { Button } from '../button/Button';
import classNames from 'classnames';

type DesktopBottomBarProps = UIElementProps & {
  onHomeClick: () => void;
  onDocsClick: () => void;
  onFeaturesClick: () => void;
  onContactClick: () => void;
  onTermsClick: () => void;
  onPrivacyPolicyClick: () => void;
  onDiscordClick: () => void;
  onTelegramClick: () => void;
  onTwitterClick: () => void;
  onBrandClick: () => void;
};

export const DesktopBottomBar = (props: DesktopBottomBarProps) => {
  const {
    onHomeClick,
    onFeaturesClick,
    className,
    onDocsClick,
    onContactClick,
    onTermsClick,
    onPrivacyPolicyClick,
    onDiscordClick,
    onTelegramClick,
    onTwitterClick,
    onBrandClick
  } = props;

  return (
    <>
      <div className={styles.divider} />
      <div className={classNames(styles.root, className)}>
        <Container direction="row" className={styles.left}>
          <div className={styles.logo}>warp.</div>
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
            onClick={onFeaturesClick}
          >
            Features
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
            onClick={onContactClick}
          >
            Contact
          </Button>
          <Button
            className={classNames(styles.button, styles.btn_gray)}
            variant="primary"
            fill="none"
            onClick={onBrandClick}
          >
            Brand Assets
          </Button>
          <Button
            className={classNames(styles.button, styles.btn_gray)}
            variant="primary"
            fill="none"
            onClick={onTermsClick}
          >
            Terms of use
          </Button>
          <Button
            className={classNames(styles.button, styles.btn_gray)}
            variant="primary"
            fill="none"
            onClick={onPrivacyPolicyClick}
          >
            Privacy Policy
          </Button>
        </Container>
        <Container direction="row" className={styles.right}>
          <Button
            className={styles.button}
            variant="secondary"
            gutters="none"
            icon={<DiscordIcon />}
            iconGap="small"
            onClick={onDiscordClick}
          />
          <Button
            className={styles.button}
            variant="secondary"
            gutters="none"
            icon={<TelegramIcon />}
            iconGap="small"
            onClick={onTelegramClick}
          />
          <Button
            className={styles.button}
            variant="secondary"
            gutters="none"
            icon={<TwitterIcon />}
            iconGap="small"
            onClick={onTwitterClick}
          />
        </Container>
      </div>
    </>
  );
};
