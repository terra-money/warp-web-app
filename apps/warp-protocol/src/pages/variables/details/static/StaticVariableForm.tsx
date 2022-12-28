import { Form, UIElementProps } from '@terra-money/apps/components';
import { StaticVariableState, staticVariableToInput, useStaticVariableForm } from 'forms/variables';
import { useEffect, useMemo } from 'react';
import { isMatch } from 'lodash';
import classNames from 'classnames';
import { Text, TextInput } from 'components/primitives';
import { FormControl } from 'components/form-control/FormControl';
import { InputAdornment } from '@mui/material';

import styles from './StaticVariableForm.module.sass';
import { warp_controller } from 'types/contracts/warp_controller';
import { VariableKindInput } from 'pages/variables/variable-kind-input/VariableKindInput';

export type StaticVariableFormProps = UIElementProps & {
  selectedVariable?: warp_controller.StaticVariable;
  renderActions: (formState: StaticVariableState) => JSX.Element;
};

const staticVariableKinds: warp_controller.VariableKind[] = [
  'string',
  'uint',
  'int',
  'decimal',
  'bool',
  'amount',
  'asset',
  'timestamp',
];

export const StaticVariableForm = (props: StaticVariableFormProps) => {
  const { className, selectedVariable, renderActions } = props;
  const [input, formState] = useStaticVariableForm();
  const { name, nameError, value, kind, submitDisabled, valueError } = formState;

  useEffect(() => {
    if (selectedVariable && selectedVariable.name !== name) {
      input(staticVariableToInput(selectedVariable));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVariable]);

  const variableModified = useMemo(
    () =>
      !isMatch(staticVariableToInput(selectedVariable), {
        name,
        default_value: value,
        kind,
      }),
    [selectedVariable, name, value, kind]
  );

  return (
    <>
      <Form className={classNames(styles.root, className)}>
        <FormControl label="Variable name" fullWidth className={styles.name_input}>
          <TextInput
            placeholder="Type name here"
            margin="none"
            value={name}
            onChange={(value) => {
              input({ name: value.target.value });
            }}
            fullWidth
            helperText={nameError}
            error={nameError !== undefined}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {name && name.length > 0 && <Text variant="label">{`${name?.length ?? 0}/140`}</Text>}
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
        <VariableKindInput
          label="Variable type"
          className={styles.kind_input}
          value={kind}
          options={staticVariableKinds}
          placeholder="Select variable type"
          onChange={(value) => {
            input({ kind: value });
          }}
        />
        <FormControl label="Value" fullWidth className={styles.value_input}>
          <TextInput
            placeholder="Type value here"
            margin="none"
            value={value}
            onChange={(v) => {
              input({ value: v.target.value });
            }}
            fullWidth
            helperText={valueError}
            error={valueError !== undefined}
          />
        </FormControl>
      </Form>
      {renderActions({ ...formState, submitDisabled: submitDisabled || !variableModified })}
    </>
  );
};
