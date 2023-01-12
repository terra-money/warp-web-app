import { Variable } from 'pages/variables/useVariableStorage';

export interface ListData {
  variables: Variable[];
  selectedVariable?: Variable;
  onSelectionChanged: (variable: Variable) => void;
}
