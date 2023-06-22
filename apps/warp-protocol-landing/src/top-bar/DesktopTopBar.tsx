import { Container, UIElementProps } from '@terra-money/apps/components';

import styles from './DesktopTopBar.module.sass';
import { Button } from '../button/Button';
import classNames from 'classnames';
import { forwardRef } from 'react';

type DesktopTopBarProps = UIElementProps & {
  onHomeClick: () => void;
  onDocsClick: () => void;
  onFeaturesClick: () => void;
  onWebAppClick: () => void;
};

export const DesktopTopBar = forwardRef<
  HTMLDivElement | null,
  DesktopTopBarProps
>((props, ref) => {
  const { onHomeClick, onFeaturesClick, onDocsClick, onWebAppClick } = props;

  return (
    <div className={styles.root} ref={ref}>
      <Container direction="row" className={styles.left}>
        <div className={styles.logo}>warp.</div>
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
