import { Text } from 'components/primitives';
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

  const [, migrateJobTx] = useMigrateJobTx();

  return (
    <div
      key={job.info.id}
      className={styles.listItem}
      style={style}
      onClick={() => {
        migrateJobTx({ job });
      }}
    >
      <Text className={styles.name} variant="text" weight="bold">
        {job.info.name}
      </Text>
    </div>
  );
};
