import { Button, Throbber, Text, TextInput } from 'components/primitives';
import classNames from 'classnames';
import { Container, Form, UIElementProps } from '@terra-money/apps/components';
import { useEffect, useMemo } from 'react';
import { useContractAddress } from '@terra-money/apps/hooks';
import { useValueWithDelay } from 'hooks/useValueWithDelay';
import { useSimulateQuery } from 'queries/useSimulateQuery';
import { QueryVariableState, queryVariableToInput, useQueryVariableForm } from 'forms/variables';
import { usePreviewQueryDialog } from 'components/dialog/preview-query/PreviewQueryDialog';
import { FormControl } from 'components/form-control/FormControl';
import { InputAdornment } from '@mui/material';
import { TemplateForm } from 'pages/job-new/details-form/template-form/TemplateForm';
import { QuerySelectorInput } from 'forms/QueryExprForm/QuerySelectorInput';
import { WasmMsgInput } from 'forms/QueryExprForm/WasmMsgInput';
import { useTemplatesQuery } from 'queries';
import { isMatch } from 'lodash';
import { QueryVariable } from 'pages/variables/useVariableStorage';

import styles from './QueryVariableForm.module.sass';
import { warp_controller } from 'types/contracts/warp_controller';
import { VariableKindInput } from 'pages/variables/variable-kind-input/VariableKindInput';

export type QueryVariableFormProps = UIElementProps & {
  selectedVariable?: QueryVariable;
  renderActions: (formState: QueryVariableState) => JSX.Element;
};

type TabType = 'template' | 'message';

const tabTypes = ['template', 'message'] as TabType[];

const queryVarKinds: warp_controller.VariableKind[] = [
  'string',
  'uint',
  'int',
  'decimal',
  'bool',
  'amount',
  'asset',
  'timestamp',
];

export const useQueryExample = () => {
  const contractAddress = useContractAddress('warp-controller');

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
    selectedTabType,
    queryJson,
    queryJsonError,
    querySelector,
    querySelectorError,
    paths,
    template,
    submitDisabled,
    kind,
  } = formState;

  const queryJsonToValidate = useValueWithDelay(queryJson);
  const { isLoading, data, isFetching, error } = useSimulateQuery(queryJsonToValidate);

  const queryExample = useQueryExample();
  const openPreview = usePreviewQueryDialog();

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

  const { data: options = [] } = useTemplatesQuery({ kind: 'query' });

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
        default_value: { query: queryJson, selector: querySelector },
        kind,
      }),
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

        <Container className={styles.tabs} direction="row">
          {tabTypes.map((tabType) => (
            <Button
              className={classNames(styles.tab, tabType === selectedTabType && styles.selected_tab)}
              onClick={() => input({ selectedTabType: tabType })}
              variant="secondary"
            >
              {tabType}
            </Button>
          ))}
        </Container>
        {selectedTabType === 'template' && (
          <>
            <TemplateForm
              options={options}
              template={template}
              setTemplate={(template) => input({ template })}
              setTemplateVars={(vars) =>
                input({
                  template: { ...(template as warp_controller.Template), vars: vars.map((v) => ({ static: v })) },
                })
              }
              // TODO: append paths to vars
              // templateVars={template?.vars ?? []}
              templateVars={[]}
              onMessageComposed={(message) => input({ queryJson: message })}
            />
          </>
        )}
        {selectedTabType === 'message' && (
          <>
            <WasmMsgInput
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
          </>
        )}

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
