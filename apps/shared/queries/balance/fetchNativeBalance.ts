import { NetworkInfo } from '@terra-money/wallet-provider';
import { LCDClient } from '@terra-money/feather.js';
import { u } from '../../types';
import Big from 'big.js';

export const fetchNativeBalance = async (
  networkOrLCD: NetworkInfo | LCDClient,
  walletAddr: string,
  denom: string
): Promise<u<Big>> => {
  const lcd =
    networkOrLCD instanceof LCDClient
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

  const [coins] = await lcd.bank.balance(walletAddr);

  const coin = coins.get(denom);

  return Big(coin === undefined ? 0 : coin.amount.toNumber()) as u<Big>;
};
