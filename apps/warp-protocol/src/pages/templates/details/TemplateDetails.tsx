import { Container, Form, UIElementProps } from '@terra-money/apps/components';
import classNames from 'classnames';
import { Panel } from 'components/panel';
import { isMatch, isEqual } from 'lodash';
import { Button, Text, TextInput, Throbber } from 'components/primitives';
import { useEffect, useMemo } from 'react';
import styles from './TemplateDetails.module.sass';
import { ReactComponent as TrashIcon } from 'components/assets/Trash.svg';
import { ReactComponent as PlusIcon } from 'components/assets/Plus.svg';
import { templateToInput, TemplateVar, useTemplateNewForm } from 'pages/template-new/useTemplateNewForm';
import { FormControl } from 'components/form-control/FormControl';
import { QuerySelectorInputField } from 'forms/QueryExprForm/QuerySelectorInputField';
import { TemplateMessageInput } from 'pages/template-new/template-message/TemplateMessageInput';
import { warp_controller } from 'types';
import { useDeleteTemplateTx, useEditTemplateTx } from 'tx';
import { VariableKindInput } from 'pages/variables/variable-kind-input/VariableKindInput';
import { filterUnreferencedVariables } from 'utils/variable';

type TemplateDetailsProps = UIElementProps & {
  selectedTemplate: warp_controller.Template | undefined;
  onSaveTemplate: (template: warp_controller.Template) => void;
  onDeleteTemplate: (template: warp_controller.Template) => void;
  isLoading: boolean;
};

const templateVarKinds: warp_controller.VariableKind[] = [
  'string',
  'uint',
  'int',
  'decimal',
  'bool',
  'amount',
  'asset',
  'timestamp',
];

export const TemplateDetails = (props: TemplateDetailsProps) => {
  const { className, selectedTemplate, onSaveTemplate, onDeleteTemplate, isLoading } = props;

  const [input, formState] = useTemplateNewForm(selectedTemplate);

  const { name, msg, submitDisabled, formattedStr, vars, paths } = formState;

  useEffect(() => {
    if (selectedTemplate && selectedTemplate.name !== name) {
      input(templateToInput(selectedTemplate));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplate]);

  const templateModified = useMemo(
    () =>
      !isMatch(templateToInput(selectedTemplate), { msg, formattedStr, vars, name }) ||
      !isEqual(selectedTemplate?.vars ?? [], vars),
    [selectedTemplate, name, formattedStr, vars, msg]
  );

  const [editTemplateTxResult, editTemplateTx] = useEditTemplateTx();
  const [deleteTemplateTxResult, deleteTemplateTx] = useDeleteTemplateTx();

  const updateTemplateVar = (idx: number, updates: Partial<TemplateVar>) => {
    const updatedVars = [...vars];
    const prev = updatedVars[idx];
    updatedVars[idx] = { ...prev, ...updates };
    return updatedVars;
  };

  return (
    <Panel className={classNames(styles.root, className)}>
      <Text variant="label" className={styles.title}>
        Template preview
      </Text>
      {selectedTemplate ? (
        <>
          <Form className={styles.form}>
            <Container className={styles.left} direction="column">
              <FormControl label="Template name">
                <TextInput
                  placeholder="Type template name here"
                  margin="none"
                  value={name}
                  onChange={(value) => {
                    input({ name: value.target.value });
                  }}
                />
              </FormControl>
              {Object.values(vars).map((templateVar, idx) => {
                return (
                  <Container className={styles.variable} direction="row">
                    <Container className={styles.variable_inputs} direction="column">
                      <Container>
                        <FormControl label={`Variable ${idx + 1}`} className={styles.variable_name_input}>
                          <TextInput
                            placeholder="Type variable name here"
                            margin="none"
                            value={templateVar.name}
                            onChange={(value) => {
                              input({ vars: updateTemplateVar(idx, { name: value.target.value }) });
                            }}
                          />
                        </FormControl>
                        <VariableKindInput
                          label=""
                          className={styles.variable_kind_input}
                          value={templateVar.kind}
                          options={templateVarKinds}
                          placeholder="Select variable type"
                          onChange={(value) => {
                            input({ vars: updateTemplateVar(idx, { kind: value }) });
                          }}
                        />
                      </Container>
                      <QuerySelectorInputField
                        hideAdornment={true}
                        placeholder="Type variable path here"
                        className={styles.variable_input}
                        onChange={(val) => {
                          input({ vars: updateTemplateVar(idx, { path: val }) });
                        }}
                        value={templateVar.path}
                        options={paths}
                      />
                    </Container>
                    <Button
                      className={styles.delete_btn}
                      icon={
                        <TrashIcon
                          onClick={() => {
                            input({ vars: vars.filter((v) => v.name !== templateVar.name) });
                          }}
                        />
                      }
                      iconGap="none"
                    />
                  </Container>
                );
              })}
              <Button
                className={styles.new_variable}
                variant="secondary"
                iconGap="none"
                icon={<PlusIcon className={styles.new_icon} />}
                onClick={() => {
                  input({
                    vars: [
                      ...vars,
                      {
                        value: '',
                        path: '',
                        name: '',
                        kind: 'string',
                      },
                    ],
                  });
                }}
              />
            </Container>
            <Container className={styles.right} direction="column">
              <TemplateMessageInput
                className={styles.right}
                message={msg}
                setMessage={(msg) => input({ msg })}
                templateStr={formattedStr}
                setTemplateStr={(str) => input({ formattedStr: str })}
              />
            </Container>
          </Form>

          <Container direction="row" className={styles.footer}>
            <Button
              variant="primary"
              disabled={submitDisabled || !templateModified}
              loading={editTemplateTxResult.loading}
              onClick={async () => {
                const res = await editTemplateTx({
                  id: selectedTemplate.id,
                  formatted_str: formattedStr,
                  msg,
                  // TODO: add condition
                  vars: filterUnreferencedVariables(
                    vars.map((v) => ({ static: v })),
                    msg
                  ),
                  name,
                });

                if (res.success) {
                  onSaveTemplate(selectedTemplate);
                }
              }}
            >
              Save
            </Button>
            <Button
              variant="danger"
              loading={deleteTemplateTxResult.loading}
              onClick={async () => {
                const res = await deleteTemplateTx({ id: selectedTemplate.id });

                if (res.success) {
                  onDeleteTemplate(selectedTemplate);
                }
              }}
            >
              Delete
            </Button>
          </Container>
        </>
      ) : isLoading ? (
        <Throbber className={styles.loading} />
      ) : (
        <Container className={styles.empty}>Select template for preview.</Container>
      )}
    </Panel>
  );
};
