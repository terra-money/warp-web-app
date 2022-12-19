import { capitalize, InputAdornment } from '@mui/material';
import { Container, UIElementProps } from '@terra-money/apps/components';
import classNames from 'classnames';
import { FormControl } from 'components/form-control/FormControl';
import { Form } from 'components/form/Form';
import { Button, Link, Text } from 'components/primitives';
import { TextInput } from 'components/primitives/text-input';
import { AmountInput } from 'pages/dashboard/jobs-widget/inputs/AmountInput';
import { WasmMsgInput } from 'forms/QueryExprForm/WasmMsgInput';
import { useNavigate } from 'react-router';
import { LUNA } from 'types';
import { Footer } from '../footer/Footer';
import styles from './DetailsForm.module.sass';
import jsonpath from 'jsonpath';
import { DetailsFormInput, useDetailsForm } from './useDetailsForm';
import { useEffect, useState } from 'react';
import { TemplatesInput } from './templates-input/TemplatesInput';
import { mockExecuteTemplates } from 'pages/templates/Templates';
import { Template } from 'pages/templates/useTemplateStorage';

type DetailsFormProps = UIElementProps & {
  onNext: (props: DetailsFormInput) => void;
  detailsInput?: DetailsFormInput;
};

const composeMsgFromTemplate = (template: Template, vars: TemplateVar[]): string => {
  let json = JSON.parse(template.msg);

  vars.forEach((v) => {
    jsonpath.value(json, v.path, v.value);
  });

  return JSON.stringify(json, null, 2);
};

type TabType = 'template' | 'message';

const tabTypes = ['template', 'message'] as TabType[];

type TemplateFormProps = {
  onMessageComposed: (message: string) => void;
  template?: Template;
  setTemplate: React.Dispatch<React.SetStateAction<Template | undefined>>;
  templateVars: TemplateVars;
  setTemplateVars: React.Dispatch<React.SetStateAction<TemplateVars>>;
  options: Template[];
};

type TemplateVar = {
  value: string;
  name: string;
  path: string;
};

export type TemplateVars = {
  [k: string]: TemplateVar;
};

export const TemplateForm = (props: TemplateFormProps) => {
  const { onMessageComposed, template, setTemplate, templateVars, setTemplateVars, options } = props;
  useEffect(() => {
    if (template) {
      setTemplateVars(
        template.vars.reduce((acc, curr) => {
          return {
            ...acc,
            [curr.name]: {
              ...curr,
              value: '',
            },
          };
        }, {})
      );
    }
  }, [template, setTemplateVars]);

  useEffect(() => {
    if (template && templateVars) {
      const msg = composeMsgFromTemplate(template, Object.values(templateVars));
      onMessageComposed(msg);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template, templateVars]);

  return (
    <>
      <TemplatesInput
        label="Template"
        className={styles.template_input}
        options={options}
        placeholder="Select a template"
        value={template}
        onChange={(tmpl) => setTemplate(tmpl)}
      />
      {template && (
        <>
          <Container className={styles.template_vars}>
            {Object.values(templateVars).map((templateVar) => {
              return (
                <FormControl label={capitalize(templateVar.name)}>
                  <TextInput
                    placeholder={`Type ${templateVar.name} here`}
                    margin="none"
                    value={templateVar.value}
                    onChange={(value) => {
                      setTemplateVars((tvs) => {
                        return {
                          ...tvs,
                          [templateVar.name]: {
                            ...templateVar,
                            value: value.target.value,
                          },
                        };
                      });
                    }}
                  />
                </FormControl>
              );
            })}
          </Container>
          <WasmMsgInput
            rootClassName={styles.template_msg_input}
            example={null}
            mode="text"
            label="Template message"
            placeholder="Type template here"
            value={template.formattedStr}
            readOnly={true}
          />
        </>
      )}
    </>
  );
};

export const DetailsForm = (props: DetailsFormProps) => {
  const { onNext, className, detailsInput } = props;

  const [template, setTemplate] = useState<Template | undefined>();
  const [templateVars, setTemplateVars] = useState<TemplateVars>({});

  const [
    input,
    {
      name,
      nameError,
      reward,
      rewardError,
      rewardValid,
      message,
      messageError,
      submitDisabled,
      tokenBalance,
      tokenBalanceLoading,
    },
  ] = useDetailsForm(detailsInput);

  const [selectedTabType, setSelectedTabType] = useState<TabType>('template');

  const navigate = useNavigate();

  const options = mockExecuteTemplates();

  return (
    <Container direction="column" className={classNames(styles.root, className)}>
      <Container className={styles.title_container}>
        <Text variant="heading1" className={styles.title}>
          Job details
        </Text>
        <Link className={styles.back} to={-1}>
          Back
        </Link>
        <Text className={styles.description} variant="label">
          Below you may enter job information including the Cosmos message payload, along with the reward provided to
          the keeper for successfully executing the job. Any tokens sent as part of the job's message must be present in
          your Warp account balance at the moment of execution.
        </Text>
      </Container>
      <Form className={styles.form}>
        <FormControl label="Name" className={styles.name_input}>
          <TextInput
            placeholder="Type name here"
            margin="none"
            value={name}
            onChange={(value) => {
              input({ name: value.target.value });
            }}
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
        <AmountInput
          className={styles.amount_input}
          label="Reward"
          value={reward}
          onChange={(value) =>
            input({
              reward: value.target.value,
            })
          }
          balance={tokenBalance}
          balanceLoading={tokenBalanceLoading}
          error={rewardError}
          token={LUNA}
          valid={rewardValid}
        />
        <Container className={styles.tabs} direction="row">
          {tabTypes.map((tabType) => (
            <Button
              className={classNames(styles.tab, tabType === selectedTabType && styles.selected_tab)}
              onClick={() => setSelectedTabType(tabType)}
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
              setTemplate={setTemplate}
              setTemplateVars={setTemplateVars}
              templateVars={templateVars}
              onMessageComposed={(message) => input({ message })}
            />
          </>
        )}
        {selectedTabType === 'message' && (
          <>
            <WasmMsgInput
              rootClassName={styles.msg_input}
              label="Message"
              className={styles.msg_input_inner}
              error={messageError}
              valid
              placeholder="Type your message here"
              value={message}
              onChange={(value) => input({ message: value })}
            />
          </>
        )}
      </Form>
      <Footer>
        <Button
          variant="primary"
          disabled={submitDisabled}
          onClick={async () => {
            if (name && reward && message) {
              onNext({ name, reward, message });
            }
          }}
        >
          Next
        </Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </Footer>
    </Container>
  );
};
