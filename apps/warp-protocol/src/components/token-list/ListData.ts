import { Token } from '@terra-money/apps/types';

export interface ListData {
  tokens: Token[];
  onSelectionChanged: (token: Token) => void;
}
