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
import { Text, TextInput, Throbber } from 'components/primitives';
import { FormControl } from 'components/form-control/FormControl';
import { InputAdornment } from '@mui/material';

import styles from './ExternalVariableForm.module.sass';
import { warp_resolver } from '@terra-money/warp-sdk';
import { VariableKindInput } from 'pages/variables/variable-kind-input/VariableKindInput';
import { EditorInput } from 'forms/QueryExprForm/EditorInput';
import { MethodInput } from './method-input/MethodInput';
import { useExternalQuery } from 'queries/useExternalQuery';
import { usePreviewExternalDialog } from './preview-dialog/PreviewExternalDialog';
import { QuerySelectorInput } from 'forms/QueryExprForm/QuerySelectorInput';
import { generatePaths } from 'utils';

const httpMethods: warp_resolver.Method[] = ['get', 'post', 'put', 'patch', 'delete'];

export type ExternalVariableFormProps = UIElementProps & {
  selectedVariable?: warp_resolver.ExternalVariable;
  renderActions: (formState: ExternalVariableState) => JSX.Element;
};

const externalVarKinds: warp_resolver.VariableKind[] = [
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

export const ExternalVariableForm = (props: ExternalVariableFormProps) => {
  const { className, selectedVariable, renderActions } = props;
  const [input, formState] = useExternalVariableForm();
  const { name, nameError, selector, kind, url, submitDisabled, urlError, selectorError, body, bodyError, method } =
    formState;

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
        body,
        method,
        kind,
      } as ExternalVariableInput),
    [selectedVariable, name, kind, url, selector, body, method]
  );

  const { isLoading, data, isFetching, error } = useExternalQuery(url, method!, body!);

  const paths = useMemo(() => {
    return data ? generatePaths(JSON.stringify(data)) : [];
  }, [data]);

  const openPreview = usePreviewExternalDialog();

  const endLabel = useMemo(() => {
    const queryIsValid = url && !urlError && method;

    if (!queryIsValid) {
      return undefined;
    }

    if (isLoading || isFetching) {
      return <Throbber />;
    }

    if (data) {
      return (
        <Text
          variant="label"
          onClick={() => openPreview({ body: body ?? undefined, url, method })}
          className={styles.preview}
        >
          Preview Query Result
        </Text>
      );
    }

    if (error) {
      return <Text variant="text">Could not fetch query result</Text>;
    }

    return undefined;
  }, [data, isLoading, isFetching, openPreview, body, url, method, error, urlError]);

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
        <MethodInput<warp_resolver.Method>
          methods={httpMethods}
          value={method ?? undefined}
          label="Method"
          className={styles.method_input}
          onChange={(value) => input({ method: value })}
        />
        <EditorInput
          rootClassName={styles.body_input}
          label="Body"
          error={bodyError}
          valid={Boolean(bodyError)}
          placeholder="Type your JSON payload here"
          example={{ empty: {} }}
          value={body ?? undefined}
          onChange={(value) => input({ body: value })}
        />
        <QuerySelectorInput
          endLabel={endLabel}
          className={styles.selector_input}
          label="Response Selector"
          onChange={(val) =>
            input({
              selector: val,
            })
          }
          value={selector}
          error={selectorError}
          options={paths}
        />
      </Form>
      {renderActions({ ...formState, submitDisabled: submitDisabled || !variableModified })}
    </>
  );
};
