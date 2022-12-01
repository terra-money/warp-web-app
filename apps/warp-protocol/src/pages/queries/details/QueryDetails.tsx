import { Container, UIElementProps } from '@terra-money/apps/components';
import classNames from 'classnames';
import { Panel } from 'components/panel';
import { isMatch } from 'lodash';
import { Button, Text } from 'components/primitives';
import { useEffect, useMemo } from 'react';
import { warp_controller } from 'types';
import styles from './QueryDetails.module.sass';
import { queryExprToInput, useQueryExprForm } from 'forms/QueryExprForm/useQueryExprForm';
import { QueryExprForm } from 'forms/QueryExprForm';
import { encodeQuery } from '../../../utils';

type QueryDetailsProps = UIElementProps & {
  selectedQuery: warp_controller.QueryExpr | undefined;
  saveQuery: (query: warp_controller.QueryExpr) => void;
  deleteQuery: (query: warp_controller.QueryExpr) => void;
};

export const QueryDetails = (props: QueryDetailsProps) => {
  const { className, selectedQuery, saveQuery, deleteQuery } = props;

  const [input, formState] = useQueryExprForm(selectedQuery);

  const { name, queryJson, submitDisabled, querySelector } = formState;

  useEffect(() => {
    if (selectedQuery && selectedQuery.name !== name) {
      input(queryExprToInput(selectedQuery));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedQuery]);

  const queryModified = useMemo(
    () => !isMatch(queryExprToInput(selectedQuery), { name, querySelector, queryJson }),
    [selectedQuery, name, querySelector, queryJson]
  );

  return (
    <Panel className={classNames(styles.root, className)}>
      <Text variant="label" className={styles.title}>
        Query preview
      </Text>
      {selectedQuery ? (
        <>
          <QueryExprForm input={input} state={formState} className={styles.form} />

          <Container direction="row" className={styles.footer}>
            <Button
              variant="primary"
              disabled={submitDisabled || !queryModified}
              onClick={async () => {
                if (queryJson && querySelector && name) {
                  const query = encodeQuery(queryJson);

                  saveQuery({
                    query,
                    selector: querySelector,
                    name,
                  });
                }
              }}
            >
              Save
            </Button>
            <Button variant="danger" onClick={() => deleteQuery(selectedQuery)}>
              Delete
            </Button>
          </Container>
        </>
      ) : (
        <Container className={styles.empty}>Select query for preview.</Container>
      )}
    </Panel>
  );
};
