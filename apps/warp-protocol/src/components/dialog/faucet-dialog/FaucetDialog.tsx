import { Button, Text } from 'components/primitives';
import { useDialog, DialogProps } from '@terra-money/apps/hooks';
import { Dialog, DialogBody, DialogFooter, DialogHeader } from 'components/dialog';
import styles from './FaucetDialog.module.sass';
import { useLocalStorage } from 'usehooks-ts';
import { useEffect, useState } from 'react';
import { useConnectedWallet } from '@terra-money/wallet-provider';

type FaucetDialogProps = {};

export const FaucetDialog = (props: DialogProps<FaucetDialogProps, boolean>) => {
  const { closeDialog } = props;

  const [, setWarningSeen] = useLocalStorage('__warp_faucet_warning_seen', false);

  return (
    <Dialog className={styles.root}>
      <DialogHeader
        title="Warning!"
        onClose={() => {
          setWarningSeen(true);
          closeDialog(undefined);
        }}
      />
      <DialogBody className={styles.body}>
        <Text variant="label" className={styles.description}>
          To interact with Warp on testnet ensure you have Luna deposited to your wallet, as Luna is used for job
          rewards and fees.
        </Text>
        <Text variant="label" className={styles.transaction}>
          In case you're out of testnet Luna, you can mint new Luna tokens using Terra faucet.
        </Text>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="primary"
          className={styles.btn}
          onClick={() => {
            window.open('https://faucet.terra.money/');
            setWarningSeen(true);
            closeDialog(undefined);
          }}
        >
          Get testnet Luna
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export const useFaucetDialog = () => {
  return useDialog<FaucetDialogProps, boolean>(FaucetDialog);
};

export const useFaucetWarning = () => {
  const [warningSeen] = useLocalStorage('__warp_faucet_warning_seen', false);
  const connectedWallet = useConnectedWallet();

  const openFaucetDialog = useFaucetDialog();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (!warningSeen && connectedWallet?.network.name === 'testnet' && !dialogOpen) {
      setDialogOpen(true);
      setTimeout(() => {
        openFaucetDialog({});
      }, 3000);
    }
  }, [warningSeen, openFaucetDialog, connectedWallet, setDialogOpen, dialogOpen]);
};
