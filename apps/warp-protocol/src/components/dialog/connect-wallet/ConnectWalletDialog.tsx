import { useWallet } from '@terra-money/wallet-kit';
import { Button, Text } from 'components/primitives';
import { useEffect, useRef, useState } from 'react';
import { useDialog, DialogProps, useLocalWallet } from '@terra-money/apps/hooks';
import { Dialog, DialogBody, DialogHeader } from 'components/dialog';
import styles from './ConnectWalletDialog.module.sass';
import { useWarpAccount } from 'queries/useWarpAccount';
import { useCreateAccountDialog } from './CreateAccountDialog';
import { warp_controller } from 'types';

type ConnectWalletDialogProps = {
  title?: string;
  subtitle?: string;
};

// TODO: filter for supported available wallets

export const ConnectWalletDialog = (props: DialogProps<ConnectWalletDialogProps, boolean>) => {
  const { closeDialog, title, subtitle } = props;
  const { connect, availableWallets } = useWallet();

  const warpAccountQuery = useWarpAccount();
  const { data: warpAccount } = warpAccountQuery;
  const openCreateAccountDialog = useCreateAccountDialog();

  const [executed, setExecuted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const localWallet = useLocalWallet();

  const warpAccountRef = useRef<warp_controller.Account>();

  warpAccountRef.current = warpAccount;

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const cb = async () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (localWallet.connectedWallet) {
        timeoutId = setTimeout(async () => {
          if (!warpAccountRef.current && !executed) {
            setExecuted(true);
            const resp = await openCreateAccountDialog({});

            if (resp) {
              closeDialog(true, { closeAll: true });
            }
          }

          if (warpAccountRef.current) {
            closeDialog(true, { closeAll: true });
          }
        }, 400);
      }
    };

    cb();

    // Clear the timeout if the component re-renders or unmounts
    return () => clearTimeout(timeoutId);
  }, [warpAccountRef, localWallet.connectedWallet, closeDialog, openCreateAccountDialog, setExecuted, executed]);

  return (
    <Dialog className={styles.root}>
      <DialogHeader title={title ?? 'Connect your wallet'} onClose={() => closeDialog(undefined, { closeAll: true })} />
      <DialogBody className={styles.body}>
        {subtitle && (
          <Text variant={'label'} className={styles.subtitle}>
            {subtitle}
          </Text>
        )}
        {availableWallets.map((c, idx) => {
          return (
            <Button
              loading={loading}
              className={styles.connection}
              key={idx}
              onClick={() => {
                connect(c.id);
                setLoading(true);
              }}
            >
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
  return useDialog<ConnectWalletDialogProps, boolean>(ConnectWalletDialog);
};
