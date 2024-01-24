import { Text } from 'components/primitives';
import { ListChildComponentProps } from 'react-window';
import { ListData } from './ListData';
import styles from './ListItem.module.sass';
import { useTokenBalanceQuery } from 'queries/useTokenBalanceQuery';
import { useNativeToken } from 'hooks/useNativeToken';
import { truncateAddress } from '@terra-money/apps/utils';
import { TokenAmount } from 'components/token-amount';
import Big from 'big.js';
import { u } from '@terra-money/apps/types';

export const ListItem = (props: ListChildComponentProps<ListData>) => {
  const {
    index,
    style,
    data: { fundingAccounts, onSelectionChanged },
  } = props;

  const fundingAccount = fundingAccounts[index];

  const token = useNativeToken();

  const { data: balance, isLoading } = useTokenBalanceQuery(fundingAccount.account_addr, token);

  return (
    <div
      key={fundingAccount.account_addr}
      className={styles.listItem}
      style={style}
      onClick={() => onSelectionChanged(fundingAccount)}
    >
      <Text className={styles.account_addr} variant="text" weight="bold">
        {truncateAddress(fundingAccount.account_addr, [8, 6])}
      </Text>
      <TokenAmount
        containerClassName={styles.balance}
        loading={isLoading}
        token={token}
        variant="text"
        decimals={2}
        amount={balance ?? (Big(0) as u<Big>)}
        showSymbol={true}
      />
    </div>
  );
};
