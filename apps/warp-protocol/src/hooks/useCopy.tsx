import { useLocalWallet } from '@terra-money/apps/hooks';
import { useSnackbar } from 'notistack';
import { useCallback } from 'react';
import { useCopyToClipboard } from 'react-use';
import { CopySnackbar } from 'components/snackbar/copy/CopySnackbar';

type CopyField = 'address' | 'message' | 'code';

const copyFieldToText: Record<CopyField, string> = {
  address: 'Address copied to clipboard!',
  message: 'Message copied to clipboard!',
  code: 'Code copied to clipboard!',
};

export const useCopy = (field: CopyField, walletAddress?: string) => {
  const [, copyToClipboard] = useCopyToClipboard();
  const localWallet = useLocalWallet();

  const { enqueueSnackbar } = useSnackbar();

  return useCallback(() => {
    copyToClipboard(walletAddress ?? localWallet.connectedWallet?.walletAddress ?? '');
    enqueueSnackbar(<CopySnackbar text={copyFieldToText[field]} />, {
      preventDuplicate: true,
      anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
      autoHideDuration: 2000,
    });
  }, [localWallet, copyToClipboard, enqueueSnackbar, field, walletAddress]);
};
