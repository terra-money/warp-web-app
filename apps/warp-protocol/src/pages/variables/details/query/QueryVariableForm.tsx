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
import { warp_resolver } from '@terra-money/warp-sdk';
import { VariableKindInput } from 'pages/variables/variable-kind-input/VariableKindInput';
import { generatePaths } from 'utils';
import { useWarpSdk } from '@terra-money/apps/hooks';
import { UpdateFnValueInput } from 'pages/variables/update-fn/UpdateFnValueInput';
import { ToggleInput } from 'pages/dashboard/jobs-widget/inputs/ToggleInput';

export type QueryVariableFormProps = UIElementProps & {
  selectedVariable?: warp_resolver.QueryVariable;
  renderActions: (formState: QueryVariableState) => JSX.Element;
};

const queryVarKinds: warp_resolver.VariableKind[] = [
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

export const useQueryExample = (): warp_resolver.QueryRequestFor_String => {
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
  const {
    name,
    nameError,
    queryJson,
    queryJsonError,
    querySelector,
    querySelectorError,
    submitDisabled,
    kind,
    onSuccess,
    onError,
    encode,
    reinitialize,
  } = formState;

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
        onSuccess,
        onError,
        encode,
        reinitialize,
      } as QueryVariableInput),
    [selectedVariable, name, kind, querySelector, queryJson, onSuccess, onError, encode, reinitialize]
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
        <ToggleInput
          className={styles.encode}
          label="Encode"
          helpText="This determines whether a variable is base64 encoded when referenced in job messages, condition or other variables."
          value={encode}
          onChange={(value) => input({ encode: value })}
        />
        <ToggleInput
          className={styles.reinitialize}
          label="Reinitialize"
          helpText="This determines whether a variable is reinitialized with a fresh value after recurring job execution."
          value={reinitialize}
          onChange={(value) => input({ reinitialize: value })}
        />
        {['decimal', 'uint', 'int'].includes(kind) && (
          <>
            <UpdateFnValueInput
              className={styles.onSuccess}
              label="On Success"
              value={onSuccess}
              onChange={(v) => {
                input({ onSuccess: v });
              }}
            />
            <UpdateFnValueInput
              className={styles.onError}
              label="On Error"
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
