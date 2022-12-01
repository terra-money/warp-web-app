import { usePricesQuery } from '@terra-money/apps/queries';
import Big from 'big.js';

// type TokenPriceResult = {
//   token: string;
//   price: string;
//   currency: string;
// };

// TODO remove this and replace where it is used with the actual usePrice hook
export const useWarpPrice = () => {
  const { data } = usePricesQuery();

  return data?.['warp'] || new Big('1.23');
};
