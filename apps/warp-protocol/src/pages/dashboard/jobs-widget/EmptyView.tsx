import { TableView } from 'components/table-widget';
import { Text } from 'components/primitives';

import styles from './JobsWidget.module.sass';
import { ActionButton } from 'components/action-button/ActionButton';
import { useNewJobDialog } from 'components/layout/dialogs/NewJobDialog';

export const EmptyView = () => {
  const openNewJobDialog = useNewJobDialog();

  return (
    <TableView>
      <Text variant="text">Nothing to display. Results will appear after a job is created.</Text>
      <ActionButton className={styles.button} variant="primary" fill="none" onClick={() => openNewJobDialog({})}>
        New job
      </ActionButton>
    </TableView>
  );
};
