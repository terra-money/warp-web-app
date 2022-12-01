import Big, { BigSource } from 'big.js';

export function max(...numbers: BigSource[]): Big {
  let maximum: Big = Big(numbers[0]);

  let i: number = 0;
  const max: number = numbers.length;
  while (++i < max) {
    if (maximum.lt(numbers[i])) {
      maximum = Big(numbers[i]);
    }
  }

  return maximum;
}
