import { Text } from 'components/primitives';

import styles from './FundingAccounts.module.sass';
import { ActionButton } from 'components/action-button/ActionButton';
import { Container } from '@terra-money/apps/components';
import { useCreateFundingAccountTx } from 'tx';
import { warp_account_tracker } from '@terra-money/warp-sdk';
import { useNewJobDialog } from 'components/layout/dialogs/NewJobDialog';

interface EmptyViewProps {
  status: warp_account_tracker.AccountStatus;
}

export const EmptyView = (props: EmptyViewProps) => {
  const { status } = props;
  const [txResult, createFundingAccountTx] = useCreateFundingAccountTx();
  const openNewJobDialog = useNewJobDialog();

  return (
    <Container className={styles.empty} direction="column">
      {status === 'free' && (
        <>
          <Text variant="text">Nothing to display. Results will appear after a funding account is created.</Text>
          <ActionButton
            loading={txResult.loading}
            className={styles.button}
            variant="primary"
            fill="none"
            onClick={() => createFundingAccountTx({})}
          >
            New funding account
          </ActionButton>
        </>
      )}
      {status === 'taken' && (
        <>
          <Text variant="text">
            Nothing to display. Results will appear after a funding account is assigned to a job.
          </Text>
          <ActionButton
            loading={txResult.loading}
            className={styles.button}
            variant="primary"
            fill="none"
            onClick={() => openNewJobDialog({})}
          >
            New job
          </ActionButton>
        </>
      )}
    </Container>
  );
};
