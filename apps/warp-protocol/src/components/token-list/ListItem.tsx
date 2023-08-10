import { Text } from 'components/primitives';
import { ListChildComponentProps } from 'react-window';
import { TokenIcon } from 'components/token-icon';
import { useLocalWallet } from '@terra-money/apps/hooks';
import { TokenBalance } from './TokenBalance';
import { ListData } from './ListData';
import styles from './ListItem.module.sass';
import { useTokenBalanceQuery } from 'queries/useTokenBalanceQuery';

export const ListItem = (props: ListChildComponentProps<ListData>) => {
  const {
    index,
    style,
    data: { tokens, onSelectionChanged },
  } = props;

  const token = tokens[index];

  const localWallet = useLocalWallet();

  const { data: balance } = useTokenBalanceQuery(localWallet.connectedWallet?.walletAddress!, token);

  return (
    <div key={token.symbol} className={styles.listItem} style={style} onClick={() => onSelectionChanged(token)}>
      <TokenIcon className={styles.icon} symbol={token.symbol} path={token.icon} />
      <Text className={styles.symbol} variant="text" weight="bold">
        {token.symbol}
      </Text>
      <Text className={styles.name} variant="label">
        {token.name}
      </Text>
      {balance && <TokenBalance className={styles.balance} balance={balance} decimals={token.decimals} />}
    </div>
  );
};
