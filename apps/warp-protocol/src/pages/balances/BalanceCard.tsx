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
import { useWarpAccount } from 'queries/useWarpAccount';
import { Panel } from 'components/panel';
import { TokenAmount } from 'components/token-amount';

interface BalanceCardProps extends UIElementProps {
  balance: Token;
  walletAddr: string;
  displayAsFiat: boolean;
}

export const BalanceCard = (props: BalanceCardProps) => {
  const { className, balance, walletAddr } = props;

  const { data: walletBalance = Big(0) as u<Big>, isLoading: isWalletBalanceLoading } = useTokenBalanceQuery(
    walletAddr,
    balance
  );

  const { data: warpAccount = { account_addr: walletAddr }, isLoading: isWarpAccountLoading } = useWarpAccount();

  // TODO: implement
  const { data: warpBalance = Big(0) as u<Big>, isLoading: isWarpBalanceLoading } = useTokenBalanceQuery(
    warpAccount.account_addr,
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
            loading={isWarpAccountLoading || isWarpBalanceLoading}
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
            })
          }
        >
          Withdraw
        </Button>
      </Container>
    </Panel>
  );
};
