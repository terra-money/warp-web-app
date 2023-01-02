import { Container, UIElementProps } from '@terra-money/apps/components';
import classNames from 'classnames';
import { FormControl } from 'components/form-control/FormControl';
import { Form } from 'components/form/Form';
import { ReactComponent as TrashIcon } from 'components/assets/Trash.svg';
import { ReactComponent as PlusIcon } from 'components/assets/Plus.svg';
import { Button, Link, Text } from 'components/primitives';
import { TextInput } from 'components/primitives/text-input';
import { useNavigate } from 'react-router';
import { Footer } from '../job-new/footer/Footer';
import styles from './TemplateNew.module.sass';
import { QuerySelectorInputField } from 'forms/QueryExprForm/QuerySelectorInputField';
import { TemplateMessageInput } from './template-message/TemplateMessageInput';
import { warp_controller } from 'types';
import { useCreateTemplateTx } from 'tx';
import { TemplateKindInput } from './template-kind-input/TemplateKindInput';
import { VariableKindInput } from '../variables/variable-kind-input/VariableKindInput';
import { TemplateVar, useTemplateNewForm } from './useTemplateNewForm';
import { useState } from 'react';
import { useCachedVariables } from 'pages/job-new/useCachedVariables';
import { useEditVariableDialog } from 'pages/variables/dialogs/VariableDialog';
import { Drawer } from '@mui/material';
import { Nav } from 'pages/variables/nav/Nav';
import { variableName } from 'utils/variable';

type TemplateNewProps = UIElementProps & {};

const templateKinds: warp_controller.TemplateKind[] = ['query', 'msg'];
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

export const TemplateNew = (props: TemplateNewProps) => {
  const { className } = props;

  const navigate = useNavigate();

  const [input, formState] = useTemplateNewForm();

  const { name, msg, submitDisabled, formattedStr, vars, kind, paths } = formState;

  const updateTemplateVar = (idx: number, updates: Partial<TemplateVar>) => {
    const updatedVars = [...vars];
    const prev = updatedVars[idx];
    updatedVars[idx] = { ...prev, ...updates };
    return updatedVars;
  };

  const [createTemplateTxResult, createTemplateTx] = useCreateTemplateTx();

  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);
  const onToggleDrawer = () => {
    setDrawerOpen((open) => !open);
  };

  const { variables, saveVariable, removeVariable } = useCachedVariables();

  const openEditVariableDialog = useEditVariableDialog();

  return (
    <Container direction="column" className={classNames(styles.root, className)}>
      <Drawer
        variant="persistent"
        anchor="right"
        open={drawerOpen}
        classes={{
          paper: styles.drawer,
        }}
      >
        <Text onClick={onToggleDrawer} variant="label" className={styles.drawer_toggle}>
          {drawerOpen ? 'Collapse' : 'Variables'}
        </Text>
        <Nav
          className={styles.variables}
          variables={variables}
          deleteVariable={(v) => removeVariable(variableName(v))}
          saveVariable={(v) => saveVariable(v)}
          onVariableClick={async (v) => {
            const resp = await openEditVariableDialog(v);

            if (resp) {
              saveVariable(resp);
            }
          }}
        />
      </Drawer>
      <Container className={styles.title_container}>
        <Text variant="heading1" className={styles.title}>
          New template
        </Text>
        <Link className={styles.back} to={-1}>
          Back
        </Link>
        <Text className={styles.description} variant="label">
          Below you may enter a job template in a human readable text format with arbitrary variable definitions,
          targeting a specific path within the execution message.
        </Text>
      </Container>
      <Form className={styles.form}>
        <Container className={styles.left} direction="column">
          <Container className={styles.top}>
            <FormControl label="Template name" className={styles.name_input}>
              <TextInput
                placeholder="Type template name here"
                margin="none"
                value={name}
                onChange={(value) => {
                  input({ name: value.target.value });
                }}
              />
            </FormControl>
            <TemplateKindInput
              value={kind}
              placeholder="Select template type"
              className={styles.template_kind_input}
              onChange={(val) => input({ kind: val })}
              label="Template type"
              options={templateKinds}
            />
          </Container>
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
                    default_value: '',
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
            message={msg}
            setMessage={(msg) => input({ msg })}
            templateStr={formattedStr}
            setTemplateStr={(formattedStr) => input({ formattedStr })}
          />
        </Container>
      </Form>
      <Footer>
        <Button
          variant="primary"
          loading={createTemplateTxResult.loading}
          disabled={submitDisabled}
          onClick={async () => {
            const res = await createTemplateTx({
              formatted_str: formattedStr,
              msg,
              kind,
              vars: vars.map((v) => ({ static: v })),
              name,
            });

            if (res.success) {
              navigate(-1);
            }
          }}
        >
          Save
        </Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </Footer>
    </Container>
  );
};
