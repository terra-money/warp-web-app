import { CW20Addr } from './index';

export type TokenBase = {
  key: string;
  name: string;
  symbol: string;
  icon: string;
  decimals: number;
  coinGeckoId?: string;
};

export type NativeToken = TokenBase & {
  type: 'native';
  denom: string;
};

export const LUNA: NativeToken = {
  key: 'uluna',
  type: 'native',
  denom: 'uluna',
  name: 'LUNA',
  symbol: 'LUNA',
  decimals: 6,
  icon: 'https://assets.terra.dev/icon/svg/LUNA.png',
  coinGeckoId: 'terra-luna-2',
};

export const NEUTRON: NativeToken = {
  key: 'untrn',
  type: 'native',
  denom: 'untrn',
  name: 'Neutron',
  symbol: 'NTRN',
  decimals: 6,
  icon: 'https://assets.terra.dev/icon/svg/ibc/ATOM.svg',
  coinGeckoId: 'neutron',
};

export const INJ: NativeToken = {
  key: 'inj',
  type: 'native',
  denom: 'inj',
  name: 'Injective',
  symbol: 'INJ',
  decimals: 18,
  icon: 'https://assets.terra.dev/icon/svg/ibc/ATOM.svg',
  coinGeckoId: 'injective-protocol',
};

export interface NativeTokensResponse {
  [tokenAddr: string]: NativeToken;
}

export type CW20Token = TokenBase & {
  type: 'cw20';
  protocol: string;
  token: CW20Addr;
};

export interface CW20TokensResponse {
  [tokenAddr: string]: CW20Token;
}

export interface TokensResponse {
  [tokenAddr: string]: IBCToken | CW20Token;
}

export type IBCToken = TokenBase & {
  type: 'ibc';
  path: string;
  base_denom: string;
  denom: string;
};

export interface IBCTokensResponse {
  [tokenAddr: string]: IBCToken;
}

export type Token = NativeToken | CW20Token | IBCToken;
