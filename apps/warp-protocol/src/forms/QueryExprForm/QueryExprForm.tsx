import { Container, UIElementProps } from '@terra-money/apps/components';
import { Dispatch, useMemo } from 'react';
import { QueryExprFormInput, QueryExprState } from 'forms/QueryExprForm/useQueryExprForm';
import { FormControl } from 'components/form-control/FormControl';
import { Button, Text, TextInput, Throbber } from 'components/primitives';
import { WasmMsgInput } from 'forms/QueryExprForm/WasmMsgInput';
import { QuerySelectorInput } from 'forms/QueryExprForm/QuerySelectorInput';
import { Form } from 'components/form/Form';
import { InputAdornment } from '@mui/material';
import styles from './QueryExprForm.module.sass';
import classNames from 'classnames';
import { useContractAddress } from '@terra-money/apps/hooks';
import { useValueWithDelay } from 'hooks/useValueWithDelay';
import { useSimulateQuery } from 'queries/useSimulateQuery';
import { generateAllPaths } from '../../utils';
import { usePreviewQueryDialog } from '../../components/dialog/preview-query/PreviewQueryDialog';
import { useTemplatesQuery } from 'queries/useTemplatesQuery';
import { TemplateForm } from 'pages/job-new/details-form/template-form/TemplateForm';
import { warp_controller } from 'types';

export type QueryExprFormProps = UIElementProps & {
  input: QueryExprFormInput;
  state: QueryExprState;
  dispatch?: Dispatch<Partial<QueryExprState>>;
  querySelectorOptions?: string[];
};

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

type TabType = 'template' | 'message';

const tabTypes = ['template', 'message'] as TabType[];

export const QueryExprForm = (props: QueryExprFormProps) => {
  const { input, state, className, querySelectorOptions } = props;
  const { name, nameError, queryJson, queryJsonError, querySelector, querySelectorError } = state;
  const queryExample = useQueryExample();

  const queryJsonToValidate = useValueWithDelay(queryJson);
  const { isLoading, data, isFetching, error } = useSimulateQuery(queryJsonToValidate);

  const paths = useMemo(() => (data ? generateAllPaths('$', data) : []), [data]);
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

  const { data: options = [] } = useTemplatesQuery();

  return (
    <Form className={classNames(styles.root, className)}>
      <FormControl label="Name" fullWidth className={styles.name_input}>
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

      <Container className={styles.tabs} direction="row">
        {tabTypes.map((tabType) => (
          <Button
            className={classNames(styles.tab, tabType === state.selectedTabType && styles.selected_tab)}
            onClick={() => input({ selectedTabType: tabType })}
            variant="secondary"
          >
            {tabType}
          </Button>
        ))}
      </Container>
      {state.selectedTabType === 'template' && (
        <>
          <TemplateForm
            options={options}
            template={state.template}
            setTemplate={(template) => input({ template })}
            setTemplateVars={(vars) => input({ template: { ...(state.template as warp_controller.Template), vars } })}
            templateVars={state.template?.vars ?? []}
            onMessageComposed={(message) => input({ queryJson: message })}
          />
        </>
      )}
      {state.selectedTabType === 'message' && (
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
        label={'Query Selector'}
        onChange={(val) =>
          input({
            querySelector: val,
          })
        }
        value={querySelector}
        error={querySelectorError}
        options={querySelectorOptions || paths}
      />
    </Form>
  );
};
