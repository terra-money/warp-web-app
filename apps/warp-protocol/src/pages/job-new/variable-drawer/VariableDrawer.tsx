import { Drawer } from '@mui/material';
import { UIElementProps } from '@terra-money/apps/components';
import { Text } from 'components/primitives';
import { useEditVariableDialog } from 'pages/variables/dialogs/VariableDialog';
import { Nav } from 'pages/variables/nav/Nav';
import { useState } from 'react';
import styles from './VariableDrawer.module.sass';
import { variableName } from 'utils/variable';
import { useCachedVariables } from '../useCachedVariables';
import { useVariableDisplayDialog } from 'pages/job-page/panels/Condition/typed-expressions/dialogs/useVariableDisplayDialog';

type VariableDrawerProps = UIElementProps & {
  readOnly?: boolean;
  open?: boolean;
};

export const VariableDrawer = (props: VariableDrawerProps) => {
  const { readOnly, open = true } = props;
  const [drawerOpen, setDrawerOpen] = useState<boolean>(open);
  const onToggleDrawer = () => {
    setDrawerOpen((open) => !open);
  };

  const { variables, saveVariable, removeVariable, updateVariable } = useCachedVariables();

  const openEditVariableDialog = useEditVariableDialog();
  const openVariableDisplayDialog = useVariableDisplayDialog();

  return (
    <Drawer
      variant="persistent"
      anchor="right"
      open={drawerOpen}
      classes={{
        paper: styles.drawer,
      }}
    >
      <Text onClick={onToggleDrawer} variant="label" className={styles.drawer_toggle}>
        {drawerOpen ? 'Collapse' : 'Variables'}
      </Text>
      <Nav
        className={styles.variables}
        variables={variables}
        readOnly={readOnly}
        saveVariable={(v) => saveVariable(v)}
        deleteVariable={(v) => removeVariable(variableName(v))}
        onVariableClick={async (v) => {
          if (readOnly) {
            await openVariableDisplayDialog(v, variables);
          } else {
            const resp = await openEditVariableDialog(v);

            if (resp) {
              updateVariable(resp, v);
            }
          }
        }}
      />
    </Drawer>
  );
};
