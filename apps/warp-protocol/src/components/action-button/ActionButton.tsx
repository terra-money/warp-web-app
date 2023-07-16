// import { ConnectType, useWallet } from '@terra-money/wallet-kit';
import { ButtonProps } from 'components/primitives';
import { ConnectedButton } from '../connected-button/ConnectedButton';

type ActionButtonProps = ButtonProps;

export const ActionButton = (props: ActionButtonProps) => {
  // const { connection } = useWallet();
  // TODO: check if readonly view dialog can work disabled={connection?.type === ConnectType.READONLY}
  return <ConnectedButton {...props} disabled={false} />;
};
