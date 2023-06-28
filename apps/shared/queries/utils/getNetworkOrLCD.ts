import { LCDClient } from '@terra-money/feather.js';
import { NetworkInfo } from '@terra-money/wallet-provider';

export const getNetworkOrLCD = (networkOrLCD: NetworkInfo | LCDClient): LCDClient => {
  return networkOrLCD instanceof LCDClient
    ? networkOrLCD
    : new LCDClient({
        [networkOrLCD.chainID]: {
          lcd: networkOrLCD.lcd,
          chainID: networkOrLCD.chainID,
          gasAdjustment: 1.75,
          gasPrices: { uluna: 0.15 },
          prefix: 'terra',
        },
      });
};
