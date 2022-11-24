import classNames from 'classnames';
import { TableCellProps } from 'react-virtualized';

import styles from './columns.module.sass';
import { Job } from 'types/job';
import { StatusPill } from 'components/primitives/status-pill/StatusPill';

export const StatusCellRenderer = (cellProps: TableCellProps) => {
  const entry = cellProps.rowData as Job;

  return <StatusPill status={entry.info.status} className={classNames(styles.col, styles.col_status)} />;
};
