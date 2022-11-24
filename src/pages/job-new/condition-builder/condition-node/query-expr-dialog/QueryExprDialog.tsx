import { DialogProps, useDialog } from 'shared/hooks';
import { Container } from 'shared/components';

import { queryExprToInput, useQueryExprForm } from 'forms/QueryExprForm/useQueryExprForm';
import { Dialog, DialogBody, DialogFooter, DialogHeader } from 'components/dialog';

import styles from './QueryExprDialog.module.sass';

import { warp_controller } from 'types';

import { QueryExprForm } from 'forms/QueryExprForm/QueryExprForm';
import { Button } from 'components/primitives';
import { useQueryStorage } from 'pages/queries/useQueryStorage';
import { QueriesNav } from 'pages/queries/nav/QueriesNav';
import { encodeQuery } from '../../../../../utils';

export type QueryExprDialogProps = {
  queryExpr?: warp_controller.QueryExpr;
  includeNav?: boolean;
};

export const QueryExprDialog = (props: DialogProps<QueryExprDialogProps, warp_controller.QueryExpr>) => {
  const { closeDialog, queryExpr, includeNav } = props;

  const [input, formState] = useQueryExprForm(queryExpr);
  const { queryJson, submitDisabled, querySelector, name } = formState;
  const { queries } = useQueryStorage();

  return (
    <Dialog className={styles.dialog}>
      {includeNav && queries.length > 0 && (
        <QueriesNav
          selectedQuery={queryExpr}
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
  return useDialog<QueryExprDialogProps, warp_controller.QueryExpr>(QueryExprDialog);
};
