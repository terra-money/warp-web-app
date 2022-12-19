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
import { LUNA, warp_controller } from 'types';
import { Footer } from '../footer/Footer';
import styles from './DetailsForm.module.sass';
import jsonpath from 'jsonpath';
import { DetailsFormInput, useDetailsForm } from './useDetailsForm';
import { useEffect, useState } from 'react';
import { TemplatesInput } from './templates-input/TemplatesInput';
import { useTemplatesQuery } from 'queries/useTemplatesQuery';
import { demicrofy, microfy } from '@terra-money/apps/libs/formatting';
import { u } from '@terra-money/apps/types';
import Big from 'big.js';
import { TokenInput } from 'pages/balances/token-input/TokenInput';
import { DateInput } from 'pages/dashboard/jobs-widget/inputs/DateInput';
import { useTokens } from '@terra-money/apps/hooks';
import { NumericInput } from 'components/primitives/numeric-input';

type DetailsFormProps = UIElementProps & {
  onNext: (props: DetailsFormInput) => void;
  detailsInput?: DetailsFormInput;
};

type TemplateVar = warp_controller.TemplateVar & { value: string };

const composeMsgFromTemplate = (template: warp_controller.Template, vars: TemplateVar[]): string => {
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
  template?: warp_controller.Template;
  setTemplate: React.Dispatch<React.SetStateAction<warp_controller.Template | undefined>>;
  templateVars: TemplateVars;
  setTemplateVars: React.Dispatch<React.SetStateAction<TemplateVars>>;
  options: warp_controller.Template[];
};

export type TemplateVars = {
  [k: string]: TemplateVar;
};

type TemplateVarInputProps = UIElementProps & {
  templateVar: TemplateVar;
  setTemplateVars: React.Dispatch<React.SetStateAction<TemplateVars>>;
};

export const TemplateVarInput = (props: TemplateVarInputProps) => {
  const { templateVar, setTemplateVars } = props;

  const { tokens } = useTokens();

  if (['int', 'uint', 'decimal'].includes(templateVar.kind)) {
    return (
      <FormControl label={capitalize(templateVar.name)}>
        <NumericInput
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
  }

  if (templateVar.kind === 'amount') {
    return (
      <AmountInput
        label={capitalize(templateVar.name)}
        value={templateVar.value && demicrofy(Big(templateVar.value) as u<Big>, 6)}
        onChange={(value) =>
          setTemplateVars((tvs) => {
            return {
              ...tvs,
              [templateVar.name]: {
                ...templateVar,
                value: value.target.value ? microfy(value.target.value, 6).toString() : (undefined as any),
              },
            };
          })
        }
      />
    );
  }

  if (templateVar.kind === 'timestamp') {
    const date = templateVar.value ? new Date(Number(templateVar.value) * 1000) : undefined;

    return (
      <DateInput
        label={capitalize(templateVar.name)}
        placeholder={`Example: "tomorrow at 15:30"`}
        value={date}
        onChange={(v) =>
          setTemplateVars((tvs) => {
            return {
              ...tvs,
              [templateVar.name]: {
                ...templateVar,
                value: Math.floor((v?.getTime() ?? 0) / 1000).toString(),
              },
            };
          })
        }
      />
    );
  }

  if (templateVar.kind === 'asset') {
    return (
      <TokenInput
        label={capitalize(templateVar.name)}
        value={tokens[templateVar.value]}
        onChange={(token) => {
          setTemplateVars((tvs) => {
            return {
              ...tvs,
              [templateVar.name]: {
                ...templateVar,
                value: token.key,
              },
            };
          });
        }}
      />
    );
  }

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
              return <TemplateVarInput templateVar={templateVar} setTemplateVars={setTemplateVars} />;
            })}
          </Container>
          <WasmMsgInput
            rootClassName={styles.template_msg_input}
            example={null}
            mode="text"
            label="Template message"
            placeholder="Type template here"
            value={template.formatted_str}
            readOnly={true}
          />
        </>
      )}
    </>
  );
};

export const DetailsForm = (props: DetailsFormProps) => {
  const { onNext, className, detailsInput } = props;

  const [template, setTemplate] = useState<warp_controller.Template | undefined>();
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

  const { data: options = [] } = useTemplatesQuery();

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
