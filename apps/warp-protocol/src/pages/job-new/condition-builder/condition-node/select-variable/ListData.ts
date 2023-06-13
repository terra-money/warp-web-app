import { warp_controller } from 'types';

export interface ListData {
  variables: warp_controller.Variable[];
  selectedVariable?: warp_controller.Variable;
  onSelectionChanged: (variable: warp_controller.Variable) => void;
}
