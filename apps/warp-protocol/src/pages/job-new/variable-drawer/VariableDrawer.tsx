import { Drawer } from '@mui/material';
import { UIElementProps } from '@terra-money/apps/components';
import { Text } from 'components/primitives';
import { useEditVariableDialog } from 'pages/variables/dialogs/VariableDialog';
import { Nav } from 'pages/variables/nav/Nav';
import { useState } from 'react';
import styles from './VariableDrawer.module.sass';
import { variableName } from 'utils/variable';
import { useCachedVariables } from '../useCachedVariables';

type VariableDrawerProps = UIElementProps & {};

export const VariableDrawer = (props: VariableDrawerProps) => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);
  const onToggleDrawer = () => {
    setDrawerOpen((open) => !open);
  };

  const { variables, saveVariable, removeVariable } = useCachedVariables();

  const openEditVariableDialog = useEditVariableDialog();

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
        saveVariable={(v) => saveVariable(v)}
        deleteVariable={(v) => removeVariable(variableName(v))}
        onVariableClick={async (v) => {
          const resp = await openEditVariableDialog(v);

          if (resp) {
            saveVariable(resp);
          }
        }}
      />
    </Drawer>
  );
};
