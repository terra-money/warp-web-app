import classNames from 'classnames';
import { TableCellProps } from 'react-virtualized';
import { Text } from 'components/primitives';

import styles from './columns.module.sass';
import { Job } from 'types/job';
import { useNavigate } from 'react-router';

export const IdCellRenderer = (cellProps: TableCellProps) => {
  const entry = cellProps.rowData as Job;

  const navigate = useNavigate();

  return (
    <Text
      className={classNames(styles.col, styles.col_id)}
      variant="text"
      onClick={() => navigate(`/jobs/${entry.info.id}`)}
    >
      {entry.info.id}
    </Text>
  );
};
