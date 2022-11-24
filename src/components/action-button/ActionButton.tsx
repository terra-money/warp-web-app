import { ConnectType, useWallet } from '@terra-money/wallet-provider';
import { ButtonProps } from 'components/primitives';
import { ConnectedButton } from '../connected-button/ConnectedButton';

type ActionButtonProps = ButtonProps;

export const ActionButton = (props: ActionButtonProps) => {
  const { connection } = useWallet();

  return <ConnectedButton {...props} disabled={connection?.type === ConnectType.READONLY} />;
};
