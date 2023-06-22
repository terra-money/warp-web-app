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
  );
};
