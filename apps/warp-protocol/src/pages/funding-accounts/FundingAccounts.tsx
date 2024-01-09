import { Button, Text, Throbber } from 'components/primitives';
import { Container } from '@terra-money/apps/components';
import { ReactComponent as PlusIcon } from 'components/assets/Plus.svg';
import styles from './FundingAccounts.module.sass';
import { ActionButton } from 'components/action-button/ActionButton';
import { FundingAccountCard } from './FundingAccountCard';
import { EmptyView } from './EmptyView';
import { useFundingAccountsQuery } from 'queries';
import { useCreateFundingAccountTx } from 'tx';
import { warp_account_tracker } from '@terra-money/warp-sdk';
import { useState } from 'react';
import { useLocalWallet } from '@terra-money/apps/hooks';
import classNames from 'classnames';

interface FundingAccountsProps {}

const accountStatuses = ['free', 'taken'] as warp_account_tracker.AccountStatus[];

export const FundingAccounts = (props: FundingAccountsProps) => {
  const [selectedAccountStatus, setSelectedAccountStatus] = useState<warp_account_tracker.AccountStatus>('free');

  const { walletAddress } = useLocalWallet();

  const { data: fundingAccounts = [], isLoading } = useFundingAccountsQuery({
    account_owner_addr: walletAddress,
    account_status: selectedAccountStatus,
  });

  const [txResult, createFundingAccountTx] = useCreateFundingAccountTx();

  return (
    <Container className={styles.root} direction="column">
      <Container className={styles.header} direction="column">
        <Text variant="heading1" className={styles.title}>
          FundingAccounts
        </Text>
        <Container className={styles.top}>
          <Container className={styles.tabs} direction="row">
            {accountStatuses.map((curr) => (
              <Button
                key={curr}
                className={classNames(styles.tab, curr === selectedAccountStatus && styles.selected_tab)}
                onClick={() => setSelectedAccountStatus(curr)}
                variant="secondary"
              >
                {curr}
              </Button>
            ))}
          </Container>
          <ActionButton
            className={styles.new}
            icon={<PlusIcon className={styles.new_icon} />}
            iconGap="none"
            variant="primary"
            loading={txResult.loading}
            onClick={() => createFundingAccountTx({})}
          >
            New
          </ActionButton>
        </Container>
      </Container>
      {isLoading && fundingAccounts.length === 0 && <Throbber className={styles.throbber} />}
      <Container className={styles.fundingAccounts}>
        {fundingAccounts.map((acc) => {
          return <FundingAccountCard key={acc.account_addr} fundingAccount={acc} />;
        })}
      </Container>
      {!isLoading && fundingAccounts.length === 0 && <EmptyView />}
    </Container>
  );
};
