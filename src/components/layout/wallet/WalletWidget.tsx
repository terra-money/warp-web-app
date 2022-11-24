import { ClickAwayListener } from '@mui/material';
import { useConnectedWallet, useWallet, WalletStatus } from '@terra-money/wallet-provider';
import { UIElementProps } from 'shared/components';
import { useCallback, useState } from 'react';
import { Container } from 'shared/components';
import { Button, ButtonProps } from 'components/primitives';
import { ReactComponent as WalletIcon } from 'components/assets/Wallet.svg';
import classNames from 'classnames';
import styles from './WalletWidget.module.sass';
import { useConnectWalletDialog } from 'components/dialog/connect-wallet';
import { Menu, MenuItem } from 'components/menu/Menu';
import { useCopy } from 'hooks/useCopy';

interface NotConnectedButtonProps extends Pick<ButtonProps, 'onClick'> {}

const NotConnectedButton = (props: NotConnectedButtonProps) => {
  const { onClick } = props;
  const { status } = useWallet();

  return (
    <Container
      className={status !== WalletStatus.INITIALIZING ? styles.not_connected : styles.initializing}
      direction="row"
    >
      <Button variant="secondary" gutters="none" icon={<WalletIcon />} iconGap="none" onClick={onClick} />
    </Container>
  );
};

interface ConnectedButtonProps {
  address: string;
  onClick: () => void;
}

const ConnectedButton = (props: ConnectedButtonProps) => {
  const { onClick } = props;

  return (
    <Container className={styles.connected} direction="row">
      <Button variant="secondary" gutters="none" icon={<WalletIcon />} iconGap="none" onClick={onClick} />
    </Container>
  );
};

export const WalletWidget = (props: UIElementProps) => {
  const { className } = props;

  const copy = useCopy('address');
  const { disconnect } = useWallet();

  const connectedWallet = useConnectedWallet();

  const [open, setOpen] = useState(false);

  const disconnectWallet = useCallback(() => {
    setOpen(false);
    disconnect();
  }, [setOpen, disconnect]);

  const openConnectWalletDialog = useConnectWalletDialog();

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div className={classNames(styles.root, className)}>
        {connectedWallet === undefined || connectedWallet.walletAddress === undefined ? (
          <NotConnectedButton onClick={() => openConnectWalletDialog({})} />
        ) : (
          <>
            <ConnectedButton address={connectedWallet.walletAddress} onClick={() => setOpen((open) => !open)} />
            {open && (
              <Menu className={styles.menu}>
                <MenuItem onClick={disconnectWallet}>Disconnect</MenuItem>
                <MenuItem
                  onClick={() => {
                    copy();
                    setOpen(false);
                  }}
                >
                  Copy wallet address
                </MenuItem>
              </Menu>
            )}
          </>
        )}
      </div>
    </ClickAwayListener>
  );
};
