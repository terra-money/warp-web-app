import classNames from 'classnames';
import { TableCellProps } from 'react-virtualized';
import { Text } from 'components/primitives';

import styles from './columns.module.sass';
import { Job } from 'types/job';
import { truncateAddress } from '@terra-money/apps/utils';
import { useCopy } from 'hooks';

export const CreatorCellRenderer = (cellProps: TableCellProps) => {
  const entry = cellProps.rowData as Job;

  const copy = useCopy('address', entry.info.owner);

  return (
    <Text className={classNames(styles.col, styles.col_creator)} variant="text" onClick={copy}>
      {truncateAddress(entry.info.owner, [8, 6])}
    </Text>
  );
};
