import { UIElementProps } from '@terra-money/apps/components';

import styles from './TopContent.module.sass';
import classNames from 'classnames';
import { Button } from 'button';
import { Text } from 'text';

type TopContentProps = UIElementProps & {
  onWebAppClick: () => void;
  onDocsClick: () => void;
};

export const TopContent = (props: TopContentProps) => {
  const { onWebAppClick, onDocsClick, className } = props;

  return (
    <div className={classNames(styles.root, className)}>
      <img
        alt=""
        src="images/BackgroundBigBall.png"
        className={styles.big_background}
      />
      <div className={styles.left}>
        <div className={styles.title}>Limitless on-chain automation</div>
        <Text variant="label" className={styles.description}>
          Limited only by a developer’s imagination, Warp enables developers to
          integrate new features into their platform with cost-efficient,
          decentralized automation.
        </Text>
        <div className={styles.buttons}>
          <Button
            className={styles.button}
            variant="primary"
            onClick={onWebAppClick}
          >
            Launch app
          </Button>
          <Button
            className={styles.button}
            variant="secondary"
            onClick={onDocsClick}
          >
            Read the docs
          </Button>
        </div>
      </div>
      <div className={styles.frames}>
        <img alt="" src="images/frame1.png" className={styles.frame1} />
        <img alt="" src="images/frame3.png" className={styles.frame3} />
        <img alt="" src="images/frame2.png" className={styles.frame2} />
      </div>
    </div>
  );
};
