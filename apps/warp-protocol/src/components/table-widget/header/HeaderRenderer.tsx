import classNames from 'classnames';
import { Link } from 'components/primitives/link';
import { SortDirection, SortDirectionType } from 'react-virtualized';

import styles from './HeaderRenderer.module.sass';

export type Sort<SortBy extends string> = {
  sortBy: SortBy;
  direction: SortDirectionType;
};

export type HeaderRendererProps<SortBy extends string> = {
  dataKey: string;
  disableSort?: boolean;
  className?: string;
  label?: any;
  sort?: Sort<SortBy>;
  setSort: (sort: Sort<SortBy> | undefined) => void;
};

function toggleSort<SortBy extends string>(sort: Sort<SortBy> | undefined, dataKey: string): Sort<SortBy> | undefined {
  if (sort?.sortBy === dataKey && sort?.direction === SortDirection.ASC) {
    return undefined;
  }

  const direction = !sort || sort.sortBy !== dataKey ? SortDirection.DESC : SortDirection.ASC;

  return { direction, sortBy: dataKey as SortBy };
}

export function HeaderRenderer<SortBy extends string>({
  dataKey,
  label,
  sort,
  setSort,
  className,
  disableSort,
}: HeaderRendererProps<SortBy>) {
  return (
    <Link
      className={classNames(
        className,
        styles.root,
        sort?.sortBy === dataKey && !disableSort && styles[`root_${sort.direction.toLowerCase()}`],
        disableSort && styles.disable_sort
      )}
      onClick={() => setSort(toggleSort(sort, dataKey))}
    >
      {label}
    </Link>
  );
}
