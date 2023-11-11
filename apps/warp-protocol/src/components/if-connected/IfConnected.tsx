import { LocalWallet, useLocalWallet } from '@terra-money/apps/hooks';
import { useWallet, WalletStatus } from '@terra-money/wallet-kit';
import { NotConnected } from 'components/not-connected';
import { Throbber } from 'components/primitives';
import { ReactNode } from 'react';
import styles from './IfConnected.module.sass';

interface IfConnectedProps {
  then: ReactNode | ((connectedWallet: LocalWallet) => ReactNode);
  else?: ReactNode;
  hideLoader?: boolean;
}

export const IfConnected = (props: IfConnectedProps) => {
  const { then: thenChildren, else: elseChildren = <NotConnected />, hideLoader } = props;

  const localWallet = useLocalWallet();
  const wallet = useWallet();

  if (wallet.status === WalletStatus.INITIALIZING) {
    return hideLoader ? null : <Throbber className={styles.loading} variant="primary" />;
  }

  if (!localWallet.connectedWallet) {
    return <>{elseChildren}</>;
  }

  return <>{typeof thenChildren === 'function' ? thenChildren(localWallet) : thenChildren}</>;
};
