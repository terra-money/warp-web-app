import { Throbber, Text, TextInput } from 'components/primitives';
import classNames from 'classnames';
import { Form, UIElementProps } from '@terra-money/apps/components';
import { useEffect, useMemo } from 'react';
import { useValueWithDelay } from 'hooks/useValueWithDelay';
import { useSimulateQuery } from 'queries/useSimulateQuery';
import { QueryVariableInput, QueryVariableState, queryVariableToInput, useQueryVariableForm } from 'forms/variables';
import { usePreviewQueryDialog } from 'components/dialog/preview-query/PreviewQueryDialog';
import { FormControl } from 'components/form-control/FormControl';
import { InputAdornment } from '@mui/material';
import { QuerySelectorInput } from 'forms/QueryExprForm/QuerySelectorInput';
import { EditorInput } from 'forms/QueryExprForm/EditorInput';
import { isMatch } from 'lodash';

import styles from './QueryVariableForm.module.sass';
import { warp_controller } from 'types/contracts/warp_controller';
import { VariableKindInput } from 'pages/variables/variable-kind-input/VariableKindInput';
import { generatePaths } from 'utils';
import { useWarpSdk } from '@terra-money/apps/hooks';

export type QueryVariableFormProps = UIElementProps & {
  selectedVariable?: warp_controller.QueryVariable;
  renderActions: (formState: QueryVariableState) => JSX.Element;
};

const queryVarKinds: warp_controller.VariableKind[] = [
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

export const useQueryExample = (): warp_controller.QueryRequestFor_String => {
  const sdk = useWarpSdk();

  const contractAddress = sdk.chain.contracts.controller;

  return useMemo(
    () => ({
      wasm: {
        contract_info: {
          contract_addr: contractAddress,
        },
      },
    }),
    [contractAddress]
  );
};

export const QueryVariableForm = (props: QueryVariableFormProps) => {
  const { className, selectedVariable, renderActions } = props;
  const [input, formState] = useQueryVariableForm();
  const { name, nameError, queryJson, queryJsonError, querySelector, querySelectorError, submitDisabled, kind } =
    formState;

  const queryJsonToValidate = useValueWithDelay(queryJson);
  const { isLoading, data, isFetching, error } = useSimulateQuery(queryJsonToValidate);

  const queryExample = useQueryExample();
  const openPreview = usePreviewQueryDialog();

  const paths = useMemo(() => {
    return data ? generatePaths(JSON.stringify(data)) : [];
  }, [data]);

  const endLabel = useMemo(() => {
    const queryIsValid = Boolean(queryJson) && !queryJsonError;

    if (!queryIsValid) {
      return undefined;
    }

    if (isLoading || isFetching) {
      return <Throbber />;
    }

    if (data) {
      return (
        <Text variant="label" onClick={() => openPreview({ query: queryJson })} className={styles.preview}>
          Preview Query Result
        </Text>
      );
    }

    if (error) {
      return <Text variant="text">Could not fetch query result</Text>;
    }

    return undefined;
  }, [data, isLoading, isFetching, openPreview, queryJson, queryJsonError, error]);

  useEffect(() => {
    if (selectedVariable && selectedVariable.name !== name) {
      input(queryVariableToInput(selectedVariable));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVariable]);

  const variableModified = useMemo(
    () =>
      !isMatch(queryVariableToInput(selectedVariable), {
        name,
        queryJson,
        querySelector,
        kind,
      } as QueryVariableInput),
    [selectedVariable, name, kind, querySelector, queryJson]
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
          options={queryVarKinds}
          placeholder="Select variable type"
          onChange={(value) => {
            input({ kind: value });
          }}
        />

        <EditorInput
          rootClassName={styles.msg_input}
          label="Message"
          className={styles.msg_input_inner}
          error={queryJsonError}
          example={queryExample}
          valid={Boolean(queryJsonError)}
          placeholder="Type your message here"
          value={queryJson}
          onChange={(value) => input({ queryJson: value })}
        />

        <QuerySelectorInput
          endLabel={endLabel}
          className={styles.selector_input}
          label="Query Selector"
          onChange={(val) =>
            input({
              querySelector: val,
            })
          }
          value={querySelector}
          error={querySelectorError}
          options={paths}
        />
      </Form>
      {renderActions({ ...formState, submitDisabled: submitDisabled || !variableModified })}
    </>
  );
};
