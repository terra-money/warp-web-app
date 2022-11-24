import { Button, Text } from 'components/primitives';
import { useDialog, DialogProps } from 'shared/hooks';
import { Dialog, DialogBody, DialogHeader } from 'components/dialog';
import styles from './StakeWarpDialog.module.sass';
import { TextInput } from '../../primitives/text-input';
import { Container } from 'shared/components';
import { useWarpToken } from '../../../queries/useWarpToken';
import { useTokenBalanceQuery } from '../../../queries/useTokenBalanceQuery';
import { ChangeEvent, useMemo, useState } from 'react';
import Big from 'big.js';
import { useConnectedWallet } from '@terra-money/wallet-provider';

type StakeWarpDialogProps = void;

type StakeWarpDialogReturnType = {
  amount: string;
};

export const StakeWarpDialog = (props: DialogProps<StakeWarpDialogProps, StakeWarpDialogReturnType>) => {
  const { closeDialog } = props;

  const [amount, setAmount] = useState('');

  const connectedWallet = useConnectedWallet();

  const warp = useWarpToken();
  const { data: balance = 0 } = useTokenBalanceQuery(connectedWallet?.walletAddress!, warp);

  const onChange = (ev: ChangeEvent<HTMLInputElement>) => {
    let num = null;
    try {
      num = new Big(ev.target.value);
    } catch (e) {}

    if (num || !ev.target.value) {
      setAmount(ev.target.value.trim());
    }
  };

  const error = useMemo(() => {
    if (!amount) {
      return 'Amount is required';
    }

    const BigAmount = new Big(amount);

    if (BigAmount.lte(0)) {
      return 'Amount must be greater than 0';
    }

    if (BigAmount.gt(balance)) {
      return 'Insufficient balance';
    }

    return undefined;
  }, [balance, amount]);

  return (
    <Dialog className={styles.root}>
      <DialogHeader title={'Stake'} onClose={() => closeDialog(undefined)} />
      <DialogBody className={styles.body}>
        <Text variant={'label'} className={styles.subtitle}>
          Lorem ipsum is the dummy text of the printing and typesetting industry.
        </Text>

        <Container direction={'column'} className={styles.input_container}>
          <Container direction={'row'} className={styles.label_container}>
            <Text variant={'text'} className={styles.label}>
              Amount to stake
            </Text>

            <Text variant={'label'} className={styles.available}>
              Available: &nbsp;
            </Text>
            <Text variant={'text'}>{balance.toString()} WARP</Text>
          </Container>
          <TextInput
            variant={'standard'}
            className={styles.input}
            placeholder={'123'}
            value={amount}
            error={Boolean(amount) && Boolean(error)}
            helperText={Boolean(amount) ? error : undefined}
            onChange={onChange}
            InputProps={{
              endAdornment: <Text variant={'label'}>WARP</Text>,
            }}
          />
        </Container>

        <Container direction={'row'} gap={16}>
          <Button variant={'primary'} onClick={() => closeDialog({ amount })} disabled={Boolean(error)}>
            Confirm
          </Button>

          <Button onClick={() => closeDialog(undefined)}>Cancel</Button>
        </Container>
      </DialogBody>
    </Dialog>
  );
};

export const useStakeWarpDialog = () => {
  return useDialog<StakeWarpDialogProps, StakeWarpDialogReturnType>(StakeWarpDialog);
};
