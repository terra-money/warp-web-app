import { Panel } from 'components/panel';
import styles from './SmallPlaceholder.module.sass';

export const SmallPlaceholder = (): JSX.Element => {
  return (
    <Panel className={styles.placeholder}>
      <div className={styles.header} />
      <div className={styles.subheader} />
    </Panel>
  );
};
