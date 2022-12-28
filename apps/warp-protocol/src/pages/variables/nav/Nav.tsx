import { UIElementProps } from '@terra-money/apps/components';
import classNames from 'classnames';
import { Panel } from 'components/panel';
import { Text } from 'components/primitives';
import { variableName } from 'utils/variable';
import { Variable } from '../useVariableStorage';
import styles from './Nav.module.sass';

type NavProps = UIElementProps & {
  variables: Variable[];
  selectedVariable: Variable | undefined;
  setSelectedVariable: (variable: Variable) => void;
};

export const Nav = (props: NavProps) => {
  const { className, variables, selectedVariable, setSelectedVariable } = props;

  return (
    <Panel className={classNames(styles.root, className)}>
      <Text variant="label" className={styles.title}>
        Variables
      </Text>
      {variables.map((v) => (
        <div
          key={variableName(v)}
          className={classNames(
            styles.variable,
            variableName(v) === (selectedVariable && variableName(selectedVariable)) && styles.selected_variable
          )}
          onClick={() => setSelectedVariable(v)}
        >
          {variableName(v)}
        </div>
      ))}
      {variables.length === 0 && <div className={styles.empty}>No variables created yet.</div>}
    </Panel>
  );
};
