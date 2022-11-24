import classNames from 'classnames';
import { TableCellProps } from 'react-virtualized';
import { Text } from 'components/primitives';

import styles from './columns.module.sass';
import { Job } from 'types/job';
import { truncateAddress } from 'shared/utils';

export const CreatorCellRenderer = (cellProps: TableCellProps) => {
  const entry = cellProps.rowData as Job;

  return (
    <Text className={classNames(styles.col, styles.col_creator)} variant="text">
      {truncateAddress(entry.info.owner, [8, 6])}
    </Text>
  );
};
