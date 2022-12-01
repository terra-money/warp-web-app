import { HeaderRenderer, Sort } from 'components/table-widget';
import { TableHeaderProps, ColumnProps, TableCellProps } from 'react-virtualized';
import styles from './columns.module.sass';
import { ActionCellRenderer } from './action';
import { SortBy } from '../utils';
import { IdCellRenderer } from './id';
import { NameCellRenderer } from './name';
import { StatusCellRenderer } from './status';
import { RewardCellRenderer } from './reward';
import classNames from 'classnames';
import { CreatorCellRenderer } from './creator';

type JobWidgetColumnProps = {
  setSort: (sort: Sort<SortBy> | undefined) => void;
  sort: Sort<SortBy> | undefined;
  displayStreamColumn?: boolean;
};

export const jobWidgetColumns = ({ sort, setSort }: JobWidgetColumnProps): ColumnProps[] =>
  [
    {
      className: styles.cell,
      headerClassName: classNames(styles.header, styles.header_id),
      headerRenderer: (props: TableHeaderProps) => <HeaderRenderer {...props} sort={sort} setSort={setSort} />,
      dataKey: 'id',
      label: '#ID',
      width: 100,
      flexGrow: 1,
      cellRenderer: (props: TableCellProps) => <IdCellRenderer {...props} />,
    },
    {
      className: styles.cell,
      headerClassName: classNames(styles.header, styles.header_name),
      headerRenderer: (props: TableHeaderProps) => <HeaderRenderer {...props} sort={sort} setSort={setSort} />,
      dataKey: 'name',
      label: 'Name',
      width: 100,
      flexGrow: 1,
      cellRenderer: (props: TableCellProps) => <NameCellRenderer {...props} />,
    },
    {
      className: styles.cell,
      headerClassName: classNames(styles.header, styles.header_creator),
      headerRenderer: (props: TableHeaderProps) => <HeaderRenderer {...props} sort={sort} setSort={setSort} />,
      dataKey: 'creator',
      label: 'Creator',
      width: 100,
      flexGrow: 1,
      cellRenderer: (props: TableCellProps) => <CreatorCellRenderer {...props} />,
    },
    {
      className: styles.cell,
      headerClassName: classNames(styles.header, styles.header_reward),
      headerRenderer: (props: TableHeaderProps) => <HeaderRenderer {...props} sort={sort} setSort={setSort} />,
      dataKey: 'reward',
      label: 'Reward',
      width: 100,
      flexGrow: 1,
      cellRenderer: (props: TableCellProps) => <RewardCellRenderer {...props} />,
    },
    {
      className: styles.cell,
      headerClassName: classNames(styles.header, styles.header_status),
      headerRenderer: (props: TableHeaderProps) => <HeaderRenderer {...props} sort={sort} setSort={setSort} />,
      dataKey: 'status',
      label: 'Status',
      width: 0,
      flexGrow: 1,
      cellRenderer: (props: TableCellProps) => <StatusCellRenderer {...props} />,
    },
    {
      className: styles.cell,
      headerClassName: classNames(styles.header, styles.header_action),
      headerRenderer: (props: TableHeaderProps) => <HeaderRenderer {...props} sort={sort} setSort={setSort} />,
      dataKey: 'action',
      label: 'Action',
      width: 20,
      flexGrow: 1,
      disableSort: true,
      cellRenderer: (props: TableCellProps) => <ActionCellRenderer {...props} />,
    },
  ].filter(Boolean) as ColumnProps[];
