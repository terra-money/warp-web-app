import styles from './TopContent.module.sass';
import classNames from 'classnames';
import { Button } from 'button';
import { Text } from 'text';
import { UIElementProps } from '@terra-money/apps/components';

type TopContentProps = UIElementProps & {
  onDownloadAll: () => void;
};

export const TopContent = (props: TopContentProps) => {
  const { onDownloadAll, className } = props;

  return (
    <div className={classNames(styles.root, className)}>
      <div className={styles.title}>Brand Assets</div>
      <Text variant="label" className={styles.description}>
        Download Warp Protocol logos and assets here.
      </Text>
      <div className={styles.buttons}>
        <Button
          className={styles.button}
          variant="primary"
          onClick={onDownloadAll}
        >
          Download zip package
        </Button>
      </div>
    </div>
  );
};
