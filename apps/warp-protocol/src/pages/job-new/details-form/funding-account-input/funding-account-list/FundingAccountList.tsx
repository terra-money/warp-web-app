import { useMemo, useState } from 'react';
import { Button, Text, Throbber } from 'components/primitives';
import { FixedSizeList } from 'react-window';
import { DialogProps, useDialog, useLocalWallet } from '@terra-money/apps/hooks';
import classNames from 'classnames';
import { Dialog, DialogBody, DialogHeader } from 'components/dialog';
import { ListData } from './ListData';
import { ListItem } from './ListItem';
import styles from './FundingAccountList.module.sass';
import { pluralize } from '@terra-money/apps/utils';
import { Container } from '@terra-money/apps/components';
import { warp_account_tracker } from '@terra-money/warp-sdk';
import { ReactComponent as PlusIcon } from 'components/assets/Plus.svg';
import { useFundingAccountsQuery } from 'queries';
import { ActionButton } from 'components/action-button/ActionButton';
import { useCreateFundingAccountTx } from 'tx';

const accountStatuses = ['free', 'taken'] as warp_account_tracker.AccountStatus[];

const FundingAccountListDialog = (props: DialogProps<void, string>) => {
  const { closeDialog } = props;

  const [selectedAccountStatus, setSelectedAccountStatus] = useState<warp_account_tracker.AccountStatus>('free');

  const { walletAddress } = useLocalWallet();

  const { data: fundingAccounts = [], isLoading } = useFundingAccountsQuery({
    account_owner_addr: walletAddress,
    account_status: selectedAccountStatus,
  });

  const listData = useMemo<ListData>(() => {
    const onSelectionChanged = (fundingAccount: warp_account_tracker.FundingAccount) => {
      closeDialog(fundingAccount.account_addr);
    };

    return {
      fundingAccounts,
      onSelectionChanged,
    };
  }, [fundingAccounts, closeDialog]);

  const [txResult, createFundingAccountTx] = useCreateFundingAccountTx();

  return (
    <Dialog>
      <DialogHeader title="Select Funding Account" onClose={() => closeDialog(undefined)}>
        <Container className={styles.header}>
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
      </DialogHeader>
      <DialogBody className={styles.container}>
        <Container
          className={classNames(styles.columns, {
            [styles.hide]: isLoading,
          })}
          direction="row"
        >
          <Text variant="label">{`Displaying ${listData.fundingAccounts.length} ${pluralize(
            'funding account',
            listData.fundingAccounts.length
          )}`}</Text>
          <Text variant="label">Balance</Text>
        </Container>
        {isLoading && <Throbber className={styles.throbber} />}
        {isLoading === false && (
          <FixedSizeList<ListData>
            className={styles.list}
            itemData={listData}
            height={300}
            width={520}
            itemSize={60}
            itemCount={listData.fundingAccounts.length}
            overscanCount={5}
          >
            {ListItem}
          </FixedSizeList>
        )}
      </DialogBody>
    </Dialog>
  );
};

export const useFundingAccountListDialog = () => {
  return useDialog(FundingAccountListDialog);
};
