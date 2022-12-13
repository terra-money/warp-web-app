import { Container, Form, UIElementProps } from '@terra-money/apps/components';
import classNames from 'classnames';
import { Panel } from 'components/panel';
import { isMatch } from 'lodash';
import { Button, Text, TextInput } from 'components/primitives';
import { useEffect, useMemo } from 'react';
import styles from './TemplateDetails.module.sass';
import { Template } from '../useTemplateStorage';
import { ReactComponent as TrashIcon } from 'components/assets/Trash.svg';
import { ReactComponent as PlusIcon } from 'components/assets/Plus.svg';
import { templateToInput, useTemplateNewForm } from 'pages/template-new/useTemplateNewForm';
import { FormControl } from 'components/form-control/FormControl';
import { QuerySelectorInputField } from 'forms/QueryExprForm/QuerySelectorInputField';
import { parseJsonValue } from 'pages/template-new/TemplateNew';
import { generateAllPaths } from 'utils';
import { TemplateMessageInput } from 'pages/template-new/template-message/TemplateMessageInput';

type TemplateDetailsProps = UIElementProps & {
  selectedTemplate: Template | undefined;
  saveTemplate: (template: Template) => void;
  deleteTemplate: (template: Template) => void;
};

export const TemplateDetails = (props: TemplateDetailsProps) => {
  const { className, selectedTemplate, deleteTemplate } = props;

  const [input, formState] = useTemplateNewForm(selectedTemplate);

  const { name, msg, submitDisabled, formattedStr, vars } = formState;

  useEffect(() => {
    if (selectedTemplate && selectedTemplate.name !== name) {
      input(templateToInput(selectedTemplate));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplate]);

  const templateModified = useMemo(
    () => !isMatch(templateToInput(selectedTemplate), { msg, formattedStr, vars, name }),
    [selectedTemplate, name, formattedStr, vars, msg]
  );

  const messageJson = parseJsonValue(msg);
  const paths = useMemo(() => (messageJson ? generateAllPaths('$', messageJson) : []), [messageJson]);

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
                      <FormControl label={`Variable ${idx + 1}`}>
                        <TextInput
                          placeholder="Type variable name here"
                          margin="none"
                          value={templateVar.name}
                          onChange={(value) => {
                            // TODO: implement
                          }}
                        />
                      </FormControl>
                      <QuerySelectorInputField
                        hideAdornment={true}
                        placeholder="Type variable path here"
                        className={styles.variable_input}
                        onChange={(val) => {
                          // TODO: implement
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
                            // TODO: implement
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
                  // TODO: implement
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
              onClick={async () => {
                // TODO: implement
              }}
            >
              Save
            </Button>
            <Button variant="danger" onClick={() => deleteTemplate(selectedTemplate)}>
              Delete
            </Button>
          </Container>
        </>
      ) : (
        <Container className={styles.empty}>Select template for preview.</Container>
      )}
    </Panel>
  );
};