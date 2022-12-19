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
import { v4 as uuid } from 'uuid';
import { useMemo, useState } from 'react';
import { generateAllPaths } from 'utils';
import { QuerySelectorInputField } from 'forms/QueryExprForm/QuerySelectorInputField';
import { TemplateMessageInput } from './template-message/TemplateMessageInput';
import { warp_controller } from 'types';
import { useCreateTemplateTx } from 'tx';

type TemplateNewProps = UIElementProps & {};

type TemplateVar = warp_controller.TemplateVar & {
  key: string;
};

type TemplateVars = {
  [k: string]: TemplateVar;
};

export const parseJsonValue = (str?: string) => {
  let value = undefined;

  try {
    value = str ? JSON.parse(str) : undefined;
  } catch (e) {}

  return value;
};

export const TemplateNew = (props: TemplateNewProps) => {
  const { className } = props;

  const navigate = useNavigate();

  const [templateVars, setTemplateVars] = useState<TemplateVars>({});
  const [templateName, setTemplateName] = useState<string>();
  const [templateStr, setTemplateStr] = useState<string>();
  const [message, setMessage] = useState<string>();

  const messageJson = parseJsonValue(message);
  const paths = useMemo(() => (messageJson ? generateAllPaths('$', messageJson) : []), [messageJson]);

  const [createTemplateTxResult, createTemplateTx] = useCreateTemplateTx();

  return (
    <Container direction="column" className={classNames(styles.root, className)}>
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
          <FormControl label="Template name">
            <TextInput
              placeholder="Type template name here"
              margin="none"
              value={templateName}
              onChange={(value) => {
                setTemplateName(value.target.value);
              }}
            />
          </FormControl>
          {Object.values(templateVars).map((templateVar, idx) => {
            return (
              <Container className={styles.variable} direction="row">
                <Container className={styles.variable_inputs} direction="column">
                  <FormControl label={`Variable ${idx + 1}`}>
                    <TextInput
                      placeholder="Type variable name here"
                      margin="none"
                      value={templateVar.name}
                      onChange={(value) => {
                        setTemplateVars((tvs) => {
                          return {
                            ...tvs,
                            [templateVar.key]: {
                              ...templateVar,
                              name: value.target.value,
                            },
                          };
                        });
                      }}
                    />
                  </FormControl>
                  <QuerySelectorInputField
                    hideAdornment={true}
                    placeholder="Type variable path here"
                    className={styles.variable_input}
                    onChange={(val) =>
                      setTemplateVars((tvs) => {
                        return {
                          ...tvs,
                          [templateVar.key]: {
                            ...templateVar,
                            path: val,
                          },
                        };
                      })
                    }
                    value={templateVar.path}
                    options={paths}
                  />
                </Container>
                <Button
                  className={styles.delete_btn}
                  icon={
                    <TrashIcon
                      onClick={() => {
                        setTemplateVars((tvs) => {
                          const { [templateVar.key]: _omit, ...rest } = tvs;
                          return rest;
                        });
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
              setTemplateVars((tvs) => {
                const key = uuid();
                return {
                  ...tvs,
                  [key]: {
                    key,
                    path: '',
                    name: '',
                    kind: 'string',
                  },
                };
              });
            }}
          />
        </Container>
        <Container className={styles.right} direction="column">
          <TemplateMessageInput
            message={message}
            setMessage={setMessage}
            templateStr={templateStr}
            setTemplateStr={setTemplateStr}
          />
        </Container>
      </Form>
      <Footer>
        <Button
          variant="primary"
          loading={createTemplateTxResult.loading}
          // disabled={submitDisabled}
          onClick={async () => {
            const result = await createTemplateTx({
              formatted_str: templateStr ?? '',
              kind: 'msg',
              msg: message ?? '',
              name: templateName ?? '',
              vars: Object.values(templateVars).map((v) => {
                const { key: omit, ...rest } = v;
                return rest;
              }),
            });

            if (result.success) {
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
