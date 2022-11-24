import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import { useCopyToClipboard } from 'react-use';
import { CopySnackbar } from 'components/snackbar/copy/CopySnackbar';

type CopyField = 'address' | 'message';

const copyFieldToText: Record<CopyField, string> = {
  address: 'Address copied to clipboard!',
  message: 'Message copied to clipboard!',
};

export const useCopy = (field: CopyField, walletAddress?: string) => {
  const [, copyToClipboard] = useCopyToClipboard();
  const connectedWallet = useConnectedWallet();

  const { enqueueSnackbar } = useSnackbar();

  return useCallback(() => {
    copyToClipboard(walletAddress ?? connectedWallet?.walletAddress ?? '');
    enqueueSnackbar(<CopySnackbar text={copyFieldToText[field]} />, {
      preventDuplicate: true,
      anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
      autoHideDuration: 2000,
    });
  }, [connectedWallet, copyToClipboard, enqueueSnackbar, field, walletAddress]);
};
