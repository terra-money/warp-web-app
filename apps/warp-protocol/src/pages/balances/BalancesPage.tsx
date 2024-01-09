import { useParams } from 'react-router';
import { Balances } from './Balances';

export const BalancesPage = () => {
  const { fundingAccountAddress } = useParams();

  return <Balances fundingAccountAddress={fundingAccountAddress ?? ''} />;
};
