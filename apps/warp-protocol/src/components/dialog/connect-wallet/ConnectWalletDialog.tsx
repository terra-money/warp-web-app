import { useWallet } from '@terra-money/wallet-kit';
import { Button, Text } from 'components/primitives';
import { useDialog, DialogProps } from '@terra-money/apps/hooks';
import { Dialog, DialogBody, DialogHeader } from 'components/dialog';
import styles from './ConnectWalletDialog.module.sass';

type ConnectWalletDialogProps = {
  title?: string;
  subtitle?: string;
};

export const ConnectWalletDialog = (props: DialogProps<ConnectWalletDialogProps, boolean>) => {
  const { closeDialog, title, subtitle } = props;
  const { connect, availableWallets } = useWallet();

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
              className={styles.connection}
              key={idx}
              onClick={() => {
                connect(c.id);
                closeDialog(undefined);
              }}
            >
              {fixName(c.name)}
              <img src={c.icon} alt={c.name} />
            </Button>
          );
        })}
      </DialogBody>
    </Dialog>
  );
};

const fixName = (name: string) => {
  if (name.includes('Station (Extension)')) {
    return 'Station';
  }

  if (name.includes('Terra Station (Mobile)')) {
    return 'Wallet Connect';
  }

  return name;
};

export const useConnectWalletDialog = () => {
  return useDialog<ConnectWalletDialogProps, boolean>(ConnectWalletDialog);
};
