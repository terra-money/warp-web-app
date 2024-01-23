import { Text } from 'components/primitives';
import { ListChildComponentProps } from 'react-window';
import { TokenBalance } from './TokenBalance';
import { ListData } from './ListData';
import styles from './ListItem.module.sass';
import { useTokenBalanceQuery } from 'queries/useTokenBalanceQuery';
import { useNativeToken } from 'hooks/useNativeToken';

export const ListItem = (props: ListChildComponentProps<ListData>) => {
  const {
    index,
    style,
    data: { fundingAccounts, onSelectionChanged },
  } = props;

  const fundingAccount = fundingAccounts[index];

  const token = useNativeToken();

  const { data: balance } = useTokenBalanceQuery(fundingAccount.account_addr, token);

  return (
    <div
      key={fundingAccount.account_addr}
      className={styles.listItem}
      style={style}
      onClick={() => onSelectionChanged(fundingAccount)}
    >
      <Text className={styles.symbol} variant="text" weight="bold">
        {fundingAccount.account_addr}
      </Text>
      {balance && <TokenBalance className={styles.balance} balance={balance} decimals={token.decimals} />}
    </div>
  );
};
