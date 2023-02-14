import { Container, UIElementProps } from '@terra-money/apps/components';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { isEmpty } from 'lodash';

import styles from './VariableInput.module.sass';
import { useSelectVariableDialog } from '../select-variable/SelectVariableDialog';
import { useCachedVariables } from 'pages/job-new/useCachedVariables';
import { resolveVariableRef, variableName, variableRef } from 'utils/variable';

type VariableInputProps = UIElementProps & {
  value: string;
  onChange: (value: string) => void;
};

export function VariableInput(props: VariableInputProps) {
  const { value, onChange } = props;

  const openSelectVariableDialog = useSelectVariableDialog();

  const onVariableDialogClick = async () => {
    const resp = await openSelectVariableDialog({
      selectedVariable: isEmpty(value) ? undefined : resolveVariableRef(value, variables),
    });

    if (resp) {
      onChange(variableRef(resp));
    }
  };

  const { variables } = useCachedVariables();

  const component =
    isEmpty(value) || variables.length === 0 ? (
      <span className={styles.placeholder}>Select variable</span>
    ) : (
      <span className={styles.text}>{variableName(resolveVariableRef(value, variables))}</span>
    );

  return (
    <Container className={styles.variable_input} direction="row" onClick={() => onVariableDialogClick()}>
      {component}
      <KeyboardArrowDownIcon className={styles.chevron} />
    </Container>
  );
}
