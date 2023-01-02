import { Container, UIElementProps } from '@terra-money/apps/components';
import classNames from 'classnames';
import { Panel } from 'components/panel';
import { Button, Text } from 'components/primitives';
import { variableName } from 'utils/variable';
import { useNewVariableDialog } from '../dialogs/VariableDialog';
import { Variable } from '../useVariableStorage';
import { VariablePill } from '../variable-pill/VariablePill';
import styles from './Nav.module.sass';

type NavProps = UIElementProps & {
  variables: Variable[];
  selectedVariable?: Variable;
  saveVariable: (v: Variable) => void;
  onVariableClick: (variable: Variable) => void;
};

export const Nav = (props: NavProps) => {
  const { className, variables, selectedVariable, onVariableClick, saveVariable } = props;

  const openNewVariableDialog = useNewVariableDialog();

  return (
    <Panel className={classNames(styles.root, className)}>
      <Text variant="label" className={styles.title}>
        Variables
      </Text>
      {variables.length > 0 && (
        <Container className={styles.variables} direction="column">
          {variables.map((v) => (
            <div
              key={variableName(v)}
              className={classNames(
                styles.variable,
                selectedVariable && variableName(v) === variableName(selectedVariable) && styles.selected_variable
              )}
              onClick={() => onVariableClick(v)}
            >
              <Text variant="text" className={styles.name}>
                {variableName(v)}
              </Text>
              <VariablePill className={styles.pill} variable={v} />
            </div>
          ))}
        </Container>
      )}
      {variables.length === 0 && <div className={styles.empty}>No variables created yet.</div>}
      <Button
        variant="secondary"
        className={styles.new}
        onClick={async () => {
          const v = await openNewVariableDialog({});

          if (v) {
            saveVariable(v);
          }
        }}
      >
        New
      </Button>
    </Panel>
  );
};
