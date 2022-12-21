import { UIElementProps } from '@terra-money/apps/components';
import classNames from 'classnames';
import { Panel } from 'components/panel';
import { Text } from 'components/primitives';
import { Query } from '../useQueryStorage';
import styles from './QueriesNav.module.sass';

type QueriesNavProps = UIElementProps & {
  queries: Query[];
  selectedQuery: Query | undefined;
  setSelectedQuery: (query: Query) => void;
};

export const QueriesNav = (props: QueriesNavProps) => {
  const { className, queries, selectedQuery, setSelectedQuery } = props;

  return (
    <Panel className={classNames(styles.root, className)}>
      <Text variant="label" className={styles.title}>
        Queries
      </Text>
      {queries.map((q) => (
        <div
          key={q.name + q.selector + q.query}
          className={classNames(styles.query, q.name === selectedQuery?.name && styles.selected_query)}
          onClick={() => setSelectedQuery(q)}
        >
          {q.name}
        </div>
      ))}
      {queries.length === 0 && <div className={styles.empty}>No queries created yet.</div>}
    </Panel>
  );
};
