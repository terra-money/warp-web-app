import { Container, UIElementProps } from 'shared/components';
import classNames from 'classnames';

import styles from './Filters.module.sass';

type FiltersProps<T extends string> = UIElementProps & {
  filters: T[];
  selectedFilter: T;
  setFilter: (filter: T) => void;
};

export function Filters<Filter extends string>(props: FiltersProps<Filter>) {
  const { filters, selectedFilter, setFilter, className } = props;

  return (
    <Container className={classNames(styles.filters, className)} direction="row">
      {filters.map((f) => (
        <div
          key={f}
          className={classNames(styles.filter, f === selectedFilter && styles.selected_filter)}
          onClick={() => setFilter(f)}
        >
          {f}
        </div>
      ))}
    </Container>
  );
}
