import { Text } from 'components/primitives';

import styles from './FundingAccounts.module.sass';
import { ActionButton } from 'components/action-button/ActionButton';
import { Container } from '@terra-money/apps/components';
import { useCreateFundingAccountTx } from 'tx';

export const EmptyView = () => {
  const [txResult, createFundingAccountTx] = useCreateFundingAccountTx();

  return (
    <Container className={styles.empty} direction="column">
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
    </Container>
  );
};
