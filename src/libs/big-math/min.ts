import Big, { BigSource } from 'big.js';

export function min(...numbers: BigSource[]): Big {
  let minimum: Big = Big(numbers[0]);

  let i: number = 0;
  const max: number = numbers.length;
  while (++i < max) {
    if (minimum.gt(numbers[i])) {
      minimum = Big(numbers[i]);
    }
  }

  return minimum;
}
