import { Container } from '@terra-money/apps/components';
import { ConnectedButton } from 'components/connected-button/ConnectedButton';
import { Text } from 'components/primitives';
import styles from './NotConnected.module.sass';

const NotConnected = () => {
  return (
    <Container className={styles.root}>
      <Text variant="text">Please connect your wallet</Text>
      <ConnectedButton className={styles.button} variant="primary" fill="none">
        Connect
      </ConnectedButton>
    </Container>
  );
};

export { NotConnected };
