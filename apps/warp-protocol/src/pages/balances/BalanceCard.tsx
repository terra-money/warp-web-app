import { Container, UIElementProps } from '@terra-money/apps/components';
import classNames from 'classnames';
import { Button, Text } from 'components/primitives';
import { useAddFundsDialog } from './AddFundsDialog';
import { useWithdrawFundsDialog } from './WithdrawFundsDialog';
import Big from 'big.js';
import { Token, u } from '@terra-money/apps/types';
import { AnimatedTokenIcon } from './AnimatedTokenIcon';
import styles from './BalanceCard.module.sass';
import { useTokenBalanceQuery } from 'queries/useTokenBalanceQuery';
import { Panel } from 'components/panel';
import { TokenAmount } from 'components/token-amount';
import { useLocalWallet } from '@terra-money/apps/hooks';

interface BalanceCardProps extends UIElementProps {
  balance: Token;
  fundingAccountAddress: string;
  displayAsFiat: boolean;
}

export const BalanceCard = (props: BalanceCardProps) => {
  const { className, balance, fundingAccountAddress } = props;

  const { walletAddress } = useLocalWallet();

  const { data: walletBalance = Big(0) as u<Big>, isLoading: isWalletBalanceLoading } = useTokenBalanceQuery(
    walletAddress,
    balance
  );

  const { data: warpBalance = Big(0) as u<Big>, isLoading: isWarpBalanceLoading } = useTokenBalanceQuery(
    fundingAccountAddress,
    balance
  );

  const openAddFundsDialog = useAddFundsDialog();

  const openWithdrawFundsDialog = useWithdrawFundsDialog();

  return (
    <Panel className={classNames(className, styles.root)}>
      <Container className={styles.header} direction="row">
        <Text variant="label">{balance.symbol} balance</Text>
        <AnimatedTokenIcon className={styles.icon} token={balance} active={false} />
      </Container>
      <Container className={styles.amounts} direction="row">
        <Container direction="column">
          <Text variant="label">Account</Text>
          <TokenAmount
            loading={isWarpBalanceLoading}
            token={balance}
            variant="text"
            decimals={2}
            amount={warpBalance}
            showSymbol={true}
          />
        </Container>
        <Container direction="column">
          <Text variant="label">Wallet</Text>
          <TokenAmount
            loading={isWalletBalanceLoading}
            token={balance}
            variant="text"
            decimals={2}
            amount={walletBalance}
            showSymbol={true}
          />
        </Container>
      </Container>
      <Container className={styles.buttons} direction="row">
        <Button
          variant="secondary"
          onClick={() =>
            openAddFundsDialog({
              token: balance,
              fundingAccountAddress,
            })
          }
        >
          Deposit
        </Button>
        <Button
          variant="secondary"
          disabled={Big(warpBalance).lte(0)}
          onClick={() =>
            openWithdrawFundsDialog({
              token: balance,
              balance: warpBalance,
              fundingAccountAddress,
            })
          }
        >
          Withdraw
        </Button>
      </Container>
    </Panel>
  );
};
