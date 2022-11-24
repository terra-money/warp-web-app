import { Token } from 'types';

export interface ListData {
  tokens: Token[];
  isTokenSelected: (token: Token) => boolean;
  onSelectToken: (token: Token) => void;
  onDeselectToken: (token: Token) => void;
}
