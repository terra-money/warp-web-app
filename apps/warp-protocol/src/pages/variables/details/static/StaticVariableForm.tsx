import { Form, UIElementProps } from '@terra-money/apps/components';
import {
  StaticVariableInput,
  StaticVariableState,
  staticVariableToInput,
  useStaticVariableForm,
} from 'forms/variables';
import { useEffect, useMemo } from 'react';
import { isMatch } from 'lodash';
import classNames from 'classnames';
import { Text, TextInput } from 'components/primitives';
import { FormControl } from 'components/form-control/FormControl';
import { InputAdornment } from '@mui/material';

import styles from './StaticVariableForm.module.sass';
import { warp_resolver } from '@terra-money/warp-sdk';
import { VariableKindInput } from 'pages/variables/variable-kind-input/VariableKindInput';
import { VariableValueInput } from './variable-value-input/VariableValueInput';
import { UpdateFnValueInput } from 'pages/variables/update-fn/UpdateFnValueInput';
import { ToggleInput } from 'pages/dashboard/jobs-widget/inputs/ToggleInput';

export type StaticVariableFormProps = UIElementProps & {
  selectedVariable?: warp_resolver.StaticVariable;
  renderActions: (formState: StaticVariableState) => JSX.Element;
};

const staticVariableKinds: warp_resolver.VariableKind[] = [
  'string',
  'uint',
  'int',
  'decimal',
  'bool',
  'amount',
  'asset',
  'timestamp',
  'json',
];

export const StaticVariableForm = (props: StaticVariableFormProps) => {
  const { className, selectedVariable, renderActions } = props;
  const [input, formState] = useStaticVariableForm();
  const { name, nameError, value, kind, submitDisabled, onSuccess, onError, encode } = formState;

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
        value,
        kind,
        onSuccess,
        onError,
        encode,
      } as StaticVariableInput),
    [selectedVariable, name, value, kind, onSuccess, onError, encode]
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
            input({ kind: value, value: '' });
          }}
        />
        <VariableValueInput
          className={styles.value_input}
          label="Value"
          placeholder="Type value here"
          value={value}
          kind={kind}
          onChange={(v) => {
            input({ value: v });
          }}
        />
        <ToggleInput
          className={styles.encode}
          label="Encode"
          helpText="This determines whether a variable is base64 encoded when referenced in job messages, condition or other variables."
          value={encode}
          onChange={(value) => input({ encode: value })}
        />
        {['decimal', 'uint', 'int'].includes(kind) && (
          <>
            <UpdateFnValueInput
              className={styles.onSuccess}
              label="On Success"
              value={onSuccess}
              kind={kind}
              onChange={(v) => {
                input({ onSuccess: v });
              }}
            />
            <UpdateFnValueInput
              className={styles.onError}
              label="On Error"
              kind={kind}
              value={onError}
              onChange={(v) => {
                input({ onError: v });
              }}
            />
          </>
        )}
      </Form>
      {renderActions({ ...formState, submitDisabled: submitDisabled || !variableModified })}
    </>
  );
};
