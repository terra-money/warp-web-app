import { warp_resolver } from '@terra-money/warp-sdk';

export interface ListData {
  variables: warp_resolver.Variable[];
  selectedVariable?: warp_resolver.Variable;
  onSelectionChanged: (variable: warp_resolver.Variable) => void;
}
