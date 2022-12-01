import { Container } from '@terra-money/apps/components';
import { useConnectWalletDialog } from 'components/dialog/connect-wallet';
import { Text, Button } from 'components/primitives';
import styles from './NotConnected.module.sass';

const NotConnected = () => {
  const openConnectWalletDialog = useConnectWalletDialog();

  return (
    <Container className={styles.root}>
      <Text variant="text">Please connect your wallet</Text>
      <Button className={styles.button} variant="primary" fill="none" onClick={() => openConnectWalletDialog({})}>
        Connect
      </Button>
    </Container>
  );
};

export { NotConnected };
