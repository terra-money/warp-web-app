import { Container } from '@terra-money/apps/components';
import { ConnectedWallet, useConnectedWallet, useWallet, WalletStatus } from '@terra-money/wallet-provider';
import { NotConnected } from 'components/not-connected';
import { Button, Text, Throbber } from 'components/primitives';
import { useWarpAccount } from 'queries/useWarpAccount';
import { ReactNode } from 'react';
import { useCreateAccountTx } from 'tx';
import styles from './IfConnected.module.sass';

interface IfConnectedProps {
  then: ReactNode | ((connectedWallet: ConnectedWallet) => ReactNode);
  else?: ReactNode;
  hideLoader?: boolean;
}

export const IfConnected = (props: IfConnectedProps) => {
  const { then: thenChildren, else: elseChildren = <NotConnected />, hideLoader } = props;

  const connectedWallet = useConnectedWallet();
  const wallet = useWallet();

  const { data: warpAccount, isLoading: isWarpAccountLoading } = useWarpAccount();
  const [txResult, createAccountTx] = useCreateAccountTx();

  if (wallet.status === WalletStatus.INITIALIZING || isWarpAccountLoading) {
    return hideLoader ? null : <Throbber className={styles.loading} variant="primary" />;
  }

  if (!connectedWallet) {
    return <>{elseChildren}</>;
  }

  if (!warpAccount) {
    return (
      <Container className={styles.container} direction="column">
        <Text variant="text">In order to use Warp, please create an account.</Text>
        <Button
          loading={txResult.loading}
          className={styles.button}
          variant="primary"
          fill="none"
          onClick={() => createAccountTx({})}
        >
          Create account
        </Button>
      </Container>
    );
  }

  return <>{typeof thenChildren === 'function' ? thenChildren(connectedWallet) : thenChildren}</>;
};
