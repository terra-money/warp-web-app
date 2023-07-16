import { useWallet } from '@terra-money/wallet-kit';
import { Button, Text } from 'components/primitives';
import { useEffect, useState } from 'react';
import { useDialog, DialogProps, useLocalWallet } from '@terra-money/apps/hooks';
import { Dialog, DialogBody, DialogHeader } from 'components/dialog';
import styles from './ConnectWalletDialog.module.sass';
import { useWarpAccount } from 'queries/useWarpAccount';
import { useCreateAccountDialog } from './CreateAccountDialog';

type ConnectWalletDialogProps = {
  title?: string;
  subtitle?: string;
};

// TODO: filter for supported available wallets

export const ConnectWalletDialog = (props: DialogProps<ConnectWalletDialogProps, boolean>) => {
  const { closeDialog, title, subtitle } = props;
  const { connect, availableWallets } = useWallet();

  const { data: warpAccount, isFetching } = useWarpAccount();

  const openCreateAccountDialog = useCreateAccountDialog();

  const [executed, setExecuted] = useState<boolean>(false);

  const localWallet = useLocalWallet();

  useEffect(() => {
    const cb = async () => {
      if (localWallet.connectedWallet) {
        // // TODO: check for loading state flicker
        if (!warpAccount && !isFetching && !executed) {
          setExecuted(true);
          const resp = await openCreateAccountDialog({});

          if (resp) {
            closeDialog(true, { closeAll: true });
          }
        }

        if (warpAccount) {
          closeDialog(true, { closeAll: true });
        }
      }
    };

    cb();
  }, [
    warpAccount,
    isFetching,
    localWallet.connectedWallet,
    closeDialog,
    openCreateAccountDialog,
    setExecuted,
    executed,
  ]);

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
            <Button loading={isFetching} className={styles.connection} key={idx} onClick={() => connect(c.id)}>
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
