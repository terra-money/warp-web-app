import { Container } from 'shared/components';
import { Text, Button } from 'components/primitives';
import { useDialog, DialogProps } from 'shared/hooks';
import { FailedTransaction } from 'shared/libs/transactions';
import styles from './TxErrorDialog.module.sass';

type TxErrorDialogProps = {
  transaction: FailedTransaction;
};

export const TxErrorDialog = (props: DialogProps<TxErrorDialogProps>) => {
  const { closeDialog, transaction } = props;

  return (
    <div className={styles.root}>
      <Container className={styles.form} direction="column">
        <Text variant="heading1">Error details</Text>
        <Text variant="text" className={styles.error}>
          {transaction.error.message.slice(0, 500)}
        </Text>
      </Container>
      <Container className={styles.formButtons} direction="row">
        <Button className={styles.button} variant="secondary" onClick={() => closeDialog(undefined)}>
          Close
        </Button>
      </Container>
    </div>
  );
};

export const useTxErrorDialog = () => {
  return useDialog<TxErrorDialogProps>(TxErrorDialog);
};
