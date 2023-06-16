import { Container, UIElementProps } from '@terra-money/apps/components';
import classNames from 'classnames';
import { DropdownMenu } from 'components/dropdown-menu/DropdownMenu';
import { MenuAction } from 'components/menu-button/MenuAction';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Panel } from 'components/panel';
import { Button, Text } from 'components/primitives';
import { variableName } from 'utils/variable';
import { useNewVariableDialog } from '../dialogs/VariableDialog';
import { VariablePill } from '../variable-pill/VariablePill';
import styles from './Nav.module.sass';
import { warp_controller } from 'types';

type NavProps = UIElementProps & {
  variables: warp_controller.Variable[];
  selectedVariable?: warp_controller.Variable;
  saveVariable: (v: warp_controller.Variable) => void;
  deleteVariable: (v: warp_controller.Variable) => void;
  onVariableClick: (variable: warp_controller.Variable) => void;
};

export const Nav = (props: NavProps) => {
  const { className, variables, selectedVariable, onVariableClick, saveVariable, deleteVariable } = props;

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
            >
              <Text variant="text" className={styles.name} onClick={() => onVariableClick(v)}>
                {variableName(v)}
              </Text>
              <VariablePill className={styles.pill} variable={v} />
              <DropdownMenu menuClass={styles.menu} action={<MoreVertIcon className={styles.menu_btn} />}>
                <MenuAction onClick={() => onVariableClick(v)}>Edit</MenuAction>
                <MenuAction onClick={() => deleteVariable(v)}>Delete</MenuAction>
              </DropdownMenu>
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
