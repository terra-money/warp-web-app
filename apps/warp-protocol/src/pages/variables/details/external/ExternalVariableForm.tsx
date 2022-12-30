import { Form, UIElementProps } from '@terra-money/apps/components';
import {
  ExternalVariableInput,
  ExternalVariableState,
  externalVariableToInput,
  useExternalVariableForm,
} from 'forms/variables';
import { useEffect, useMemo } from 'react';
import { isMatch } from 'lodash';
import classNames from 'classnames';
import { Text, TextInput } from 'components/primitives';
import { FormControl } from 'components/form-control/FormControl';
import { InputAdornment } from '@mui/material';

import styles from './ExternalVariableForm.module.sass';
import { warp_controller } from 'types/contracts/warp_controller';
import { VariableKindInput } from 'pages/variables/variable-kind-input/VariableKindInput';

export type ExternalVariableFormProps = UIElementProps & {
  selectedVariable?: warp_controller.ExternalVariable;
  renderActions: (formState: ExternalVariableState) => JSX.Element;
};

const externalVarKinds: warp_controller.VariableKind[] = [
  'string',
  'uint',
  'int',
  'decimal',
  'bool',
  'amount',
  'asset',
  'timestamp',
];

export const ExternalVariableForm = (props: ExternalVariableFormProps) => {
  const { className, selectedVariable, renderActions } = props;
  const [input, formState] = useExternalVariableForm();
  const { name, nameError, selector, kind, url, submitDisabled, urlError, selectorError } = formState;

  useEffect(() => {
    if (selectedVariable && selectedVariable.name !== name) {
      input(externalVariableToInput(selectedVariable));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVariable]);

  const variableModified = useMemo(
    () =>
      !isMatch(externalVariableToInput(selectedVariable), {
        name,
        url,
        selector,
        kind,
      } as ExternalVariableInput),
    [selectedVariable, name, kind, url, selector]
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
          options={externalVarKinds}
          placeholder="Select variable type"
          onChange={(value) => {
            input({ kind: value });
          }}
        />
        <FormControl label="Url" fullWidth className={styles.url_input}>
          <TextInput
            placeholder="Type url here"
            margin="none"
            value={url}
            onChange={(value) => {
              input({ url: value.target.value });
            }}
            fullWidth
            helperText={urlError}
            error={urlError !== undefined}
          />
        </FormControl>
        <FormControl label="Response selector" fullWidth className={styles.selector_input}>
          <TextInput
            placeholder="Type selector here"
            margin="none"
            value={selector}
            onChange={(value) => {
              input({ selector: value.target.value });
            }}
            fullWidth
            helperText={selectorError}
            error={selectorError !== undefined}
          />
        </FormControl>
      </Form>
      {renderActions({ ...formState, submitDisabled: submitDisabled || !variableModified })}
    </>
  );
};
