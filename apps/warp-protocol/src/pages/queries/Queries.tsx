import styles from './Queries.module.sass';
import { Container, UIElementProps } from '@terra-money/apps/components';
import { Button, Text } from 'components/primitives';
import { Query, useQueryStorage } from './useQueryStorage';
import { useState } from 'react';
import { QueryDetails } from './details/QueryDetails';
import { IfConnected } from 'components/if-connected';
import { NotConnected } from 'components/not-connected';
import { QueriesNav } from './nav/QueriesNav';
import { useQueryExprDialog } from 'pages/job-new/condition-builder/condition-node/query-expr-dialog';

type QueriesContentProps = {};

const QueriesContent = (props: QueriesContentProps) => {
  const { queries, saveQuery, removeQuery } = useQueryStorage();
  const [selectedQuery, setSelectedQuery] = useState<Query | undefined>(undefined);

  const openQueryExprDialog = useQueryExprDialog();

  return (
    <Container direction="column" className={styles.content}>
      <Container className={styles.header}>
        <Text variant="heading1" className={styles.title}>
          Queries
        </Text>
        <Button
          variant="primary"
          onClick={async () => {
            const query = await openQueryExprDialog({});

            if (query) {
              saveQuery(query);
            }
          }}
        >
          New query
        </Button>
      </Container>
      <Container className={styles.bottom} direction="row">
        <QueriesNav
          className={styles.nav}
          selectedQuery={selectedQuery}
          queries={queries}
          setSelectedQuery={setSelectedQuery}
        />
        <QueryDetails
          className={styles.details}
          selectedQuery={selectedQuery}
          saveQuery={(q) => {
            saveQuery(q);
            setSelectedQuery(q);
          }}
          deleteQuery={(q) => {
            removeQuery(q);
            setSelectedQuery(undefined);
          }}
        />
      </Container>
    </Container>
  );
};

export const Queries = (props: UIElementProps) => {
  return (
    <IfConnected
      then={
        <Container direction="column" className={styles.root}>
          <QueriesContent />
        </Container>
      }
      else={<NotConnected />}
    />
  );
};
