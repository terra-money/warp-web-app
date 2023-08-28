import styles from './Variables.module.sass';
import { Container, UIElementProps } from '@terra-money/apps/components';
import { Button, Text } from 'components/primitives';
import { useVariableStorage } from './useVariableStorage';
import { useState } from 'react';
import { IfConnected } from 'components/if-connected';
import { NotConnected } from 'components/not-connected';
import { Nav } from './nav/Nav';
import { Details } from './details';
import { useNewVariableDialog } from './dialogs/VariableDialog';
import { variableName } from 'utils/variable';
import { warp_resolver } from '@terra-money/warp-sdk';

type VariablesContentProps = {};

const VariablesContent = (props: VariablesContentProps) => {
  const { variables, saveVariable, removeVariable, updateVariable } = useVariableStorage();
  const [selectedVariable, setSelectedVariable] = useState<warp_resolver.Variable | undefined>(undefined);

  const openNewVariableDialog = useNewVariableDialog();

  return (
    <Container direction="column" className={styles.content}>
      <Container className={styles.header}>
        <Text variant="heading1" className={styles.title}>
          Variables
        </Text>
        <Button
          variant="primary"
          onClick={async () => {
            const variable = await openNewVariableDialog({});

            if (variable) {
              saveVariable(variable);
            }
          }}
        >
          New Variable
        </Button>
      </Container>
      <Container className={styles.bottom} direction="row">
        <Nav
          className={styles.nav}
          selectedVariable={selectedVariable}
          variables={variables}
          deleteVariable={(v) => removeVariable(variableName(v))}
          saveVariable={(variable) => {
            saveVariable(variable);
            setSelectedVariable(variable);
          }}
          onVariableClick={(v) => setSelectedVariable(v)}
        />
        <Details
          className={styles.details}
          selectedVariable={selectedVariable}
          updateVariable={(variable) => {
            if (selectedVariable) {
              updateVariable(variable, selectedVariable);
              setSelectedVariable(variable);
            }
          }}
          deleteVariable={(variable) => {
            removeVariable(variable);
            setSelectedVariable(undefined);
          }}
        />
      </Container>
    </Container>
  );
};

export const Variables = (props: UIElementProps) => {
  return (
    <IfConnected
      then={
        <Container direction="column" className={styles.root}>
          <VariablesContent />
        </Container>
      }
      else={<NotConnected />}
    />
  );
};
