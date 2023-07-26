import { Panel } from 'components/panel';
import styles from './BigPlaceholder.module.sass';

export const BigPlaceholder = (): JSX.Element => {
  return (
    <Panel className={styles.placeholder}>
      <div className={styles.header} />
      <div className={styles.subheader} />
      <img
        className={styles.union}
        alt="Union"
        src="https://generation-sessions.s3.amazonaws.com/237ce22f4d8d76e2bf69a49502bb642d/img/union@2x.png"
      />

      <div className={styles.frame_4}>
        <img
          className={styles.img}
          alt="Union"
          src="https://generation-sessions.s3.amazonaws.com/237ce22f4d8d76e2bf69a49502bb642d/img/union-1.svg"
        />
      </div>
    </Panel>
  );
};
