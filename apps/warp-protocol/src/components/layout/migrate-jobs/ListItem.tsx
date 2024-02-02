import { Text, Throbber } from 'components/primitives';
import { ListChildComponentProps } from 'react-window';
import { ListData } from './ListData';
import styles from './ListItem.module.sass';
import { useMigrateJobTx } from 'tx/useMigrateJobTx';

export const ListItem = (props: ListChildComponentProps<ListData>) => {
  const {
    index,
    style,
    data: { jobs },
  } = props;

  const job = jobs[index];

  const [txResult, migrateJobTx] = useMigrateJobTx(true);

  return (
    <div
      key={job.info.id}
      className={styles.listItem}
      style={style}
      onClick={() => {
        if (!txResult.loading) {
          migrateJobTx({ job });
        }
      }}
    >
      <Text className={styles.name} variant="text" weight="bold">
        {job.info.name}
      </Text>
      {txResult.loading ? (
        <Throbber dotClassName={styles.throbber} variant="secondary" size="small" />
      ) : (
        <Text className={styles.id} variant="text" weight="bold">
          ID#{job.info.id}
        </Text>
      )}
    </div>
  );
};
