import { Button, Text } from 'components/primitives';
import { useDialog, DialogProps } from 'shared/hooks';
import { Dialog, DialogBody, DialogFooter, DialogHeader } from 'components/dialog';
import styles from './CreateAccountDialog.module.sass';
import { useCreateAccountTx } from 'tx';

type CreateAccountDialogProps = {};

export const CreateAccountDialog = (props: DialogProps<CreateAccountDialogProps, boolean>) => {
  const { closeDialog } = props;

  const [txResult, createAccountTx] = useCreateAccountTx();

  return (
    <Dialog className={styles.root}>
      <DialogHeader title="Create account" onClose={() => closeDialog(undefined)} />
      <DialogBody className={styles.body}>
        <Text variant="label" className={styles.description}>
          Account represents your own virtual wallet used for interacting with Warp. Managed as a typical wallet, you
          can view and organize your token balances within "Balances" tab.
        </Text>
        <Text variant="label" className={styles.transaction}>
          A transaction on your behalf is required to set up your Warp account.
        </Text>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="primary"
          className={styles.btn}
          loading={txResult.loading}
          onClick={async () => {
            const result = await createAccountTx({ waitForCompletion: true });

            if (result.success) {
              closeDialog(true, { closeAll: true });
            }
          }}
        >
          Create account
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export const useCreateAccountDialog = () => {
  return useDialog<CreateAccountDialogProps, boolean>(CreateAccountDialog);
};
