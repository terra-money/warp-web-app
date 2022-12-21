import { DialogProps, useDialog } from '@terra-money/apps/hooks';
import { Container } from '@terra-money/apps/components';

import { queryExprToInput, useQueryExprForm } from 'forms/QueryExprForm/useQueryExprForm';
import { Dialog, DialogBody, DialogFooter, DialogHeader } from 'components/dialog';

import styles from './QueryExprDialog.module.sass';

import { QueryExprForm } from 'forms/QueryExprForm/QueryExprForm';
import { Button } from 'components/primitives';
import { Query, useQueryStorage } from 'pages/queries/useQueryStorage';
import { QueriesNav } from 'pages/queries/nav/QueriesNav';
import { encodeQuery } from '../../../../../utils';

export type QueryExprDialogProps = {
  query?: Query;
  includeNav?: boolean;
};

export const QueryExprDialog = (props: DialogProps<QueryExprDialogProps, Query>) => {
  const { closeDialog, query, includeNav } = props;

  const [input, formState] = useQueryExprForm(query);
  const { queryJson, submitDisabled, querySelector, name, template } = formState;
  const { queries } = useQueryStorage();

  return (
    <Dialog className={styles.dialog}>
      {includeNav && queries.length > 0 && (
        <QueriesNav
          selectedQuery={query}
          className={styles.left}
          queries={queries}
          setSelectedQuery={(q) => input(queryExprToInput(q))}
        />
      )}
      <Container direction={'column'}>
        <DialogHeader title={'New Query'} onClose={() => closeDialog(undefined)} />
        <DialogBody>
          <QueryExprForm input={input} state={formState} className={styles.form} />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="primary"
            disabled={submitDisabled}
            onClick={async () => {
              if (queryJson && querySelector && name) {
                const query = encodeQuery(queryJson);

                closeDialog({
                  template,
                  query,
                  selector: querySelector,
                  name,
                });
              }
            }}
          >
            Save
          </Button>
          <Button variant="secondary" onClick={() => closeDialog(undefined)}>
            Cancel
          </Button>
        </DialogFooter>
      </Container>
    </Dialog>
  );
};

export const useQueryExprDialog = () => {
  return useDialog<QueryExprDialogProps, Query>(QueryExprDialog);
};
