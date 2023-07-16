import { LCDClient } from '@terra-money/feather.js';
import { CW20Addr } from '../../types';

export const contractQuery = async <QueryMsg extends {}, QueryResponse>(
  lcd: LCDClient,
  contractAddress: CW20Addr,
  msg: QueryMsg,
  defaultValue?: QueryResponse
): Promise<QueryResponse> => {
  try {
    return await lcd.wasm.contractQuery<QueryResponse>(contractAddress, msg);
  } catch (err) {
    //console.log(err);
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw err;
  }
};
