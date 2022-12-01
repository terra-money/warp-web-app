import { warp_controller } from 'types';
import { base64encode } from './base64encode';

export const encodeQuery = (value: string): warp_controller.QueryRequestFor_String => {
  const input = JSON.parse(value) as warp_controller.QueryRequestFor_String;

  if (!('wasm' in input)) {
    return input;
  }

  let msg = input.wasm;

  if ('smart' in msg) {
    msg.smart.msg = base64encode(msg.smart.msg);
  }

  if ('raw' in msg) {
    msg.raw.key = base64encode(msg.raw.key);
  }

  return { wasm: msg };
};
