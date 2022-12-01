import { TableView } from 'components/table-widget';
import { Text } from 'components/primitives';

import styles from './JobsWidget.module.sass';
import { ActionButton } from 'components/action-button/ActionButton';
import { useNavigate } from 'react-router';

export const EmptyView = () => {
  const navigate = useNavigate();

  return (
    <TableView>
      <Text variant="text">Nothing to display. Results will appear after a job is created.</Text>
      <ActionButton className={styles.button} variant="primary" fill="none" onClick={() => navigate('/job-new')}>
        New job
      </ActionButton>
    </TableView>
  );
};
