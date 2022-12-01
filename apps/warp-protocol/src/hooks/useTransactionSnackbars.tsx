import {
  CompletedTransaction,
  FailedTransaction,
  PendingTransaction,
  useTransactionSubscribers,
} from '@terra-money/apps/libs/transactions';
import { useWallet } from '@terra-money/wallet-provider';
import { TransactionSnackbar } from 'components/snackbar/TransactionSnackbar';
import { useSnackbar } from 'notistack';
import { useRefetchQueries } from 'queries';
import { TX_KEY } from 'tx';
import { useRefCallback } from '@terra-money/apps/hooks';
import { indexerCompletion } from 'utils';

type TxMessages = Record<TX_KEY, string>;

const CompletedSnackbarMessages: TxMessages = {
  [TX_KEY.CREATE_JOB]: 'Job created successfully',
  [TX_KEY.EDIT_JOB]: 'Job edited successfully',
  [TX_KEY.CANCEL_JOB]: 'Job canceled successfully',
  [TX_KEY.EXECUTE_JOB]: 'Job executed successfully',
  [TX_KEY.ADD_FUNDS]: 'Funds added successfully',
  [TX_KEY.WITHDRAW_FUNDS]: 'Funds withdrawed successfully',
  [TX_KEY.CREATE_ACCOUNT]: 'Account created succesfully',
};

const FailedSnackbarMessages: TxMessages = {
  [TX_KEY.CREATE_JOB]: 'Failed to create the job',
  [TX_KEY.EDIT_JOB]: 'Failed to edit the job',
  [TX_KEY.CANCEL_JOB]: 'Failed to cancel the job',
  [TX_KEY.EXECUTE_JOB]: 'Failed to execute the job',
  [TX_KEY.ADD_FUNDS]: 'Failed to add funds',
  [TX_KEY.WITHDRAW_FUNDS]: 'Failed to withdraw funds',
  [TX_KEY.CREATE_ACCOUNT]: 'Failed to create account',
};

export const useTransactionSnackbars = () => {
  const { network } = useWallet();

  const refetch = useRefetchQueries();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const onPending = useRefCallback(
    (transaction: PendingTransaction) => {
      enqueueSnackbar(
        <TransactionSnackbar transaction={transaction} variant="pending" message="Transaction pending" />,
        {
          key: transaction.txHash,
          anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
        }
      );
    },
    [enqueueSnackbar]
  );

  const onCancelled = useRefCallback(
    (transaction: PendingTransaction) => {
      closeSnackbar(transaction.txHash);
    },
    [closeSnackbar]
  );

  const onCompleted = useRefCallback(
    (transaction: CompletedTransaction) => {
      const txKey = transaction.payload['txKey'] as TX_KEY;
      indexerCompletion({
        network,
        height: transaction.height,
        txKey,
        callback: () => {
          refetch(txKey);

          closeSnackbar(transaction.txHash);

          enqueueSnackbar(
            <TransactionSnackbar
              transaction={transaction}
              variant="completed"
              message={CompletedSnackbarMessages[txKey]}
            />,
            {
              anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
              autoHideDuration: 5000,
            }
          );
        },
      });
    },
    [refetch, enqueueSnackbar, closeSnackbar]
  );

  const onFailed = useRefCallback(
    (transaction: FailedTransaction) => {
      const txKey = transaction.payload['txKey'] as TX_KEY;

      refetch(txKey);

      closeSnackbar(transaction.txHash);

      enqueueSnackbar(
        <TransactionSnackbar transaction={transaction} variant="failed" message={FailedSnackbarMessages[txKey]} />,
        {
          anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
          autoHideDuration: 5000,
        }
      );
    },
    [refetch, enqueueSnackbar, closeSnackbar]
  );

  useTransactionSubscribers({
    onPending,
    onCancelled,
    onCompleted,
    onFailed,
  });
};
