import { Text, Button } from 'components/primitives';
import { Container } from '@terra-money/apps/components';
import { BalanceCard } from './BalanceCard';
import styles from './Balances.module.sass';
import { useBalances } from './useBalances';
import { useTokenListDialog } from './token-list';
import { IfConnected } from 'components/if-connected';
import { NotConnected } from 'components/not-connected';

interface BalancesProps {
  fundingAccountAddress: string;
}

const BalancesInner = (props: BalancesProps) => {
  const { fundingAccountAddress } = props;

  const { balances, saveAll } = useBalances(fundingAccountAddress);

  const openTokenListDialog = useTokenListDialog();

  return (
    <Container className={styles.root} direction="column">
      <Container className={styles.header}>
        <Text variant="heading1" className={styles.title}>
          Balances
          <Text variant="label" className={styles.wallet}>
            {fundingAccountAddress}
          </Text>
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
              fundingAccountAddress={fundingAccountAddress}
              displayAsFiat={false}
            />
          );
        })}
      </Container>
    </Container>
  );
};

export const Balances = (props: BalancesProps) => {
  return <IfConnected then={<BalancesInner {...props} />} else={<NotConnected />} />;
};
