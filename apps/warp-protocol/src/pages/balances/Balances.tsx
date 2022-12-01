import { Text, Button } from 'components/primitives';
import { Container } from '@terra-money/apps/components';
import { BalanceCard } from './BalanceCard';
import { ConnectedWallet } from '@terra-money/wallet-provider';
import styles from './Balances.module.sass';
import { useBalances } from './useBalances';
import { useTokenListDialog } from './token-list';

interface BalancesProps {
  connectedWallet: ConnectedWallet;
}

export const Balances = (props: BalancesProps) => {
  const { connectedWallet } = props;

  const { balances, saveAll } = useBalances();

  const openTokenListDialog = useTokenListDialog();

  return (
    <Container className={styles.root} direction="column">
      <Container className={styles.header}>
        <Text variant="heading1" className={styles.title}>
          Balances
        </Text>
        <Button
          variant="primary"
          onClick={async () => {
            const tokens = await openTokenListDialog({ tokens: balances });

            if (tokens) {
              saveAll(tokens);
            }
          }}
        >
          Add token
        </Button>
      </Container>
      <Container className={styles.balances}>
        {balances.map((balance) => {
          return (
            <BalanceCard
              key={balance.key}
              balance={balance}
              walletAddr={connectedWallet.walletAddress}
              displayAsFiat={false}
            />
          );
        })}
      </Container>
    </Container>
  );
};
