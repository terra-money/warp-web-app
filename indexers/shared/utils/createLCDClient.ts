import { LCDClient } from '@terra-money/feather.js';

export const createLCDClient = (): LCDClient => {
  return new LCDClient({
    [process.env.CHAIN_ID]: {
      lcd: process.env.LCD_ENDPOINT,
      chainID: process.env.CHAIN_ID,
      gasAdjustment: 1.75,
      gasPrices: { uluna: 0.15 },
      prefix: 'terra',
    },
  });
};
