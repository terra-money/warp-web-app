import { Container, UIElementProps } from '@terra-money/apps/components';
import { Button } from 'button';
import classNames from 'classnames';
import { Text } from '../text';

import styles from './MobileBottomBar.module.sass';

type MobileBottomBarProps = UIElementProps & {
  onPrivacyPolicyClick: () => void;
  onTermsClick: () => void;
};

export const MobileBottomBar = (props: MobileBottomBarProps) => {
  const { onPrivacyPolicyClick, onTermsClick } = props;

  return (
    <div className={styles.root}>
      <Container direction="row" className={styles.top}>
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
      <div className={styles.divider} />
      <Container direction="row" className={styles.bottom}>
        <Text variant="text">2023 warp protocol. All rights reserved.</Text>
      </Container>
    </div>
  );
};
