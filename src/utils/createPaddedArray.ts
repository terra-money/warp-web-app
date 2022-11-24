import { Frequency, truncate } from './truncate';
import { subHours, subDays, subMonths } from 'date-fns';

export const createPaddedArray = (limit: number, frequency: Frequency) => {
  const from = truncate(new Date(), frequency);

  return Array.from({ length: limit }, (_, i) => {
    let date: Date;

    const amount = limit - i - 1;

    switch (frequency) {
      case 'hourly':
        date = subHours(from, amount);
        break;
      case 'daily':
        date = subDays(from, amount);
        break;
      case 'monthly':
        date = subMonths(from, amount);
        break;
    }

    return Math.trunc(date.getTime() / 1000);
  });
};
