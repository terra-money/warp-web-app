import { UIElementProps } from '@terra-money/apps/components';
import { Job } from 'types/job';
import { resolveVariableRef, variableName } from 'utils/variable';
import { useVariableDisplayDialog } from './dialogs/useVariableDisplayDialog';

import styles from './VariableValue.module.sass';

export type VariableValueProps = {
  variableRef: string;
  job: Job;
} & UIElementProps;

export const VariableValue = (props: VariableValueProps) => {
  const { job, variableRef } = props;

  const variable = resolveVariableRef(variableRef, job.vars);

  const openVariableDisplayDialog = useVariableDisplayDialog();

  return (
    <span className={styles.link} onClick={() => openVariableDisplayDialog(variable, job)}>
      {variableName(variable)}
    </span>
  );
};
