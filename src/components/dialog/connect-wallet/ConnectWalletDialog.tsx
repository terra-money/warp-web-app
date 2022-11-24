import { ConnectType, useConnectedWallet, useWallet } from '@terra-money/wallet-provider';
import { Button, Text } from 'components/primitives';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ReactComponent as WalletIcon } from 'components/assets/Wallet.svg';
import { useDialog, DialogProps } from 'shared/hooks';
import { Dialog, DialogBody, DialogHeader } from 'components/dialog';
import styles from './ConnectWalletDialog.module.sass';
import { useLocalStorage } from 'usehooks-ts';
import { useWarpAccount } from 'queries/useWarpAccount';
import { useCreateAccountDialog } from './CreateAccountDialog';

const connectionsMetadata = {
  [ConnectType.EXTENSION]: {
    icon: <WalletIcon />,
  },
  [ConnectType.WALLETCONNECT]: {
    icon: <WalletIcon />,
  },
};

const supportedSet = new Set(Object.keys(connectionsMetadata)) as Set<ConnectType>;

type ConnectWalletDialogProps = {
  title?: string;
  subtitle?: string;
};

export const ConnectWalletDialog = (props: DialogProps<ConnectWalletDialogProps, ConnectType>) => {
  const { closeDialog, title, subtitle } = props;
  const { connect, availableConnections } = useWallet();
  const [, setLastConnectedType] = useLocalStorage<ConnectType>(
    '__payment_protocol_last_connect_type',
    ConnectType.EXTENSION
  );

  const { data: warpAccount, isFetching } = useWarpAccount();

  const openCreateAccountDialog = useCreateAccountDialog();

  const [executed, setExecuted] = useState<boolean>(false);

  const connectedWallet = useConnectedWallet();

  useEffect(() => {
    const cb = async () => {
      if (connectedWallet) {
        // // TODO: check for loading state flicker
        if (!warpAccount && !isFetching && !executed) {
          setExecuted(true);
          const resp = await openCreateAccountDialog({});

          if (resp) {
            closeDialog(connectedWallet.connectType, { closeAll: true });
          }
        }

        if (warpAccount) {
          closeDialog(connectedWallet?.connectType, { closeAll: true });
        }
      }
    };

    cb();
  }, [warpAccount, isFetching, connectedWallet, closeDialog, openCreateAccountDialog, setExecuted, executed]);

  const connectWallet = useCallback(
    async (connectionType: ConnectType) => {
      connect(connectionType);
      setLastConnectedType(connectionType);
    },
    [connect, setLastConnectedType]
  );

  const supportedConnections = useMemo(
    () => availableConnections.filter((c) => supportedSet.has(c.type)),
    [availableConnections]
  );

  return (
    <Dialog className={styles.root}>
      <DialogHeader title={title ?? 'Connect your wallet'} onClose={() => closeDialog(undefined)} />
      <DialogBody className={styles.body}>
        {subtitle && (
          <Text variant={'label'} className={styles.subtitle}>
            {subtitle}
          </Text>
        )}
        {supportedConnections.map((c, idx) => {
          return (
            <Button loading={isFetching} className={styles.connection} key={idx} onClick={() => connectWallet(c.type)}>
              {c.name}
              <img src={c.icon} alt={c.name} />
            </Button>
          );
        })}
      </DialogBody>
    </Dialog>
  );
};

export const useConnectWalletDialog = () => {
  return useDialog<ConnectWalletDialogProps, ConnectType>(ConnectWalletDialog);
};
