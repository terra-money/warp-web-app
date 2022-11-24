import classNames from 'classnames';
import { TableCellProps } from 'react-virtualized';
import { TokenAmount } from 'components/token-amount';
import styles from './columns.module.sass';
import { Job } from 'types/job';
import { LUNA } from 'shared/types';

export const RewardCellRenderer = (cellProps: TableCellProps) => {
  const entry = cellProps.rowData as Job;

  return (
    <TokenAmount
      key={cellProps.dataKey}
      className={classNames(styles.col, styles.col_reward)}
      variant="text"
      decimals={2}
      token={LUNA}
      amount={entry.reward}
      showSymbol={true}
      showUsdAmount={true}
    />
  );
};
