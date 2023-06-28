import { NetworkInfo } from '@terra-money/wallet-provider';
import { LCDClient } from '@terra-money/feather.js';
import { Big } from 'big.js';
import { u } from '../../types';

interface CW20BalanceResponse {
  balance: u<Big>;
}

export const fetchCW20Balance = async (
  networkOrLCD: NetworkInfo | LCDClient,
  walletAddr: string,
  tokenAddr: string
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

  const response = await lcd.wasm.contractQuery<CW20BalanceResponse>(tokenAddr, {
    balance: {
      address: walletAddr,
    },
  });

  return Big(response?.balance ?? 0) as u<Big>;
};
