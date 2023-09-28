import { UIElementProps } from '@terra-money/apps/components';
import { warp_resolver } from '@terra-money/warp-sdk';
import { resolveVariableRef, variableName } from 'utils/variable';
import { useVariableDisplayDialog } from './dialogs/useVariableDisplayDialog';

import styles from './VariableValue.module.sass';

export type VariableValueProps = {
  variableRef: string;
  variables: warp_resolver.Variable[];
} & UIElementProps;

export const VariableValue = (props: VariableValueProps) => {
  const { variables, variableRef } = props;

  const variable = resolveVariableRef(variableRef, variables);

  const openVariableDisplayDialog = useVariableDisplayDialog();

  return (
    <span className={styles.link} onClick={() => openVariableDisplayDialog(variable, variables)}>
      {variableName(variable)}
    </span>
  );
};
