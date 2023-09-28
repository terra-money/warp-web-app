import { Button } from 'components/primitives';
import { useDialog, DialogProps } from '@terra-money/apps/hooks';
import { Dialog, DialogBody, DialogHeader } from 'components/dialog';
import styles from './EnvValueDialog.module.sass';
import { warp_resolver } from '@terra-money/warp-sdk';

type EnvValueDialogProps = {};

const numEnvValues: warp_resolver.NumEnvValue[] = ['time', 'block_height'];

export const EnvValueDialog = (props: DialogProps<EnvValueDialogProps, warp_resolver.NumEnvValue>) => {
  const { closeDialog } = props;

  return (
    <Dialog className={styles.root}>
      <DialogHeader title="Select Environment Value" onClose={() => closeDialog(undefined)} />
      <DialogBody className={styles.body}>
        {numEnvValues.map((envValue) => (
          <Button
            key={envValue}
            onClick={() => {
              closeDialog(envValue);
            }}
          >
            {envValue}
          </Button>
        ))}
      </DialogBody>
    </Dialog>
  );
};

export const useEnvValueDialog = () => {
  return useDialog<EnvValueDialogProps, warp_resolver.NumEnvValue>(EnvValueDialog);
};
