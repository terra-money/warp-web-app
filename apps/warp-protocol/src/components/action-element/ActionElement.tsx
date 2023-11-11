import { cloneElement, MouseEventHandler, useCallback } from 'react';
import { useConnectWalletDialog } from '../dialog/connect-wallet';
import { sleep } from 'utils';
import { useLocalWallet } from '@terra-money/apps/hooks';

export type ActionElementProps = {
  action: JSX.Element;
};

export const ActionElement = (props: ActionElementProps) => {
  const { action } = props;
  const localWallet = useLocalWallet();
  const openConnectDialog = useConnectWalletDialog();

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    async (event) => {
      // let connectionType: ConnectType | undefined;

      // If wallet is not connected, open connect dialog and wait for connection
      if (!localWallet.connectedWallet) {
        await openConnectDialog({
          title: 'Hold up!',
          subtitle: 'You need to connect your terra wallet to perform this action.',
        });

        // Sometimes the balance calculation is wrong
        // So we wait for a bit to make sure the balance is fetched correctly
        await sleep(200);
      }

      // If the user was already connected or just connected via extension:
      // Connections with extension are instant, so we can call onClick immediately
      // If another connection type was selected, disregard the original action
      // The user will have to press the button again after connecting
      // TODO: check if this works after removing connectionType === ConnectType.EXTENSION
      if (localWallet.connectedWallet) {
        action.props.onClick?.(event);
      }
    },
    [action, localWallet.connectedWallet, openConnectDialog]
  );

  return cloneElement(action, {
    onClick: handleClick,
  });
};
