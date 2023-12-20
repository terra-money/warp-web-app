import { Text, Button } from 'components/primitives';
import { Container } from '@terra-money/apps/components';
import { BalanceCard } from './BalanceCard';
import styles from './Balances.module.sass';
import { useBalances } from './useBalances';
import { useTokenListDialog } from './token-list';

interface BalancesProps {
  walletAddress: string;
}

export const Balances = (props: BalancesProps) => {
  const { walletAddress } = props;

  const { balances, saveAll } = useBalances(walletAddress);

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
          return <BalanceCard key={balance.key} balance={balance} walletAddr={walletAddress} displayAsFiat={false} />;
        })}
      </Container>
    </Container>
  );
};
