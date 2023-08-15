import { Big, BigSource } from 'big.js';

interface FormatAmountOptions {
  decimals: number;
}

const DEFAULT: FormatAmountOptions = {
  decimals: 2,
};

export const formatAmount = (amount: BigSource, options: FormatAmountOptions = DEFAULT) => {
  const { decimals = DEFAULT.decimals } = options;

  const formatter = new Intl.NumberFormat('en-us', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  // Convert amount to Big for precise arithmetic operations
  const bigAmount = Big(amount);
  
  // Check if the amount is smaller than the smallest representable number for the given decimals
  if (decimals > 0 && bigAmount.lt(Big(1).div(Big(10).pow(decimals)))) {
    return `< 0.${'0'.repeat(decimals - 1)}1`;
  }

  return formatter.format(bigAmount.toNumber());
};
