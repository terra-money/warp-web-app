import { Text } from 'components/primitives';
import { ListChildComponentProps } from 'react-window';
import { ListData } from './ListData';
import styles from './ListItem.module.sass';
import { useMigrateJobDialog } from './migrate-job/MigrateJobDialog';

export const ListItem = (props: ListChildComponentProps<ListData>) => {
  const {
    index,
    style,
    data: { jobs },
  } = props;

  const job = jobs[index];

  const openMigrateJobsDialog = useMigrateJobDialog();

  return (
    <div
      key={job.info.id}
      className={styles.listItem}
      style={style}
      onClick={() => {
        openMigrateJobsDialog({ job });
      }}
    >
      <Text className={styles.name} variant="text" weight="bold">
        {job.info.name}
      </Text>
      <Text className={styles.id} variant="text" weight="bold">
        ID#{job.info.id}
      </Text>
      )
    </div>
  );
};
