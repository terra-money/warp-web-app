import { IfConnected } from 'components/if-connected';
import { NotConnected } from 'components/not-connected';
import { Balances } from './Balances';

export const BalancesPage = () => {
  return (
    <IfConnected then={(connectedWallet) => <Balances connectedWallet={connectedWallet} />} else={<NotConnected />} />
  );
};
