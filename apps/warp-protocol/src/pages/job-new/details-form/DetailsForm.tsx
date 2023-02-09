import { InputAdornment } from '@mui/material';
import { Container, UIElementProps } from '@terra-money/apps/components';
import classNames from 'classnames';
import { FormControl } from 'components/form-control/FormControl';
import { Form } from 'components/form/Form';
import { Button, Link, Text } from 'components/primitives';
import { TextInput } from 'components/primitives/text-input';
import { AmountInput } from 'pages/dashboard/jobs-widget/inputs/AmountInput';
import { useNavigate } from 'react-router';
import { LUNA } from 'types';
import { Footer } from '../footer/Footer';
import styles from './DetailsForm.module.sass';
import { DetailsFormInput, useDetailsForm } from './useDetailsForm';
import { useTemplatesQuery } from 'queries/useTemplatesQuery';
import { TemplateForm } from './template-form/TemplateForm';
import { MsgInput } from 'forms/QueryExprForm/MsgInput';
import { variableName } from 'utils/variable';
import { Variable } from 'pages/variables/useVariableStorage';
import { useCachedVariables } from '../useCachedVariables';

type DetailsFormProps = UIElementProps & {
  onNext: (props: DetailsFormInput & { variables: Variable[] }) => void;
  detailsInput?: DetailsFormInput;
  loading?: boolean;
  mode: string;
};

type TabType = 'template' | 'message';

const tabTypes = ['template', 'message'] as TabType[];

export const DetailsForm = (props: DetailsFormProps) => {
  const { onNext, className, detailsInput, mode, loading } = props;

  const [
    input,
    {
      name,
      nameError,
      reward,
      rewardError,
      rewardValid,
      message,
      selectedTabType,
      template,
      messageError,
      submitDisabled,
      tokenBalance,
      tokenBalanceLoading,
    },
  ] = useDetailsForm(detailsInput);

  const navigate = useNavigate();

  const { data: options = [] } = useTemplatesQuery({ kind: 'msg' });

  const { variables, updateVariable } = useCachedVariables();

  return (
    <Container direction="column" className={classNames(styles.root, className)}>
      <Container className={styles.title_container}>
        <Text variant="heading1" className={styles.title}>
          New job
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
              key={tabType}
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
              setTemplateVars={(updatedVars) =>
                input({
                  template: {
                    ...template!,
                    vars: template!.vars.map((v) => {
                      const updated = updatedVars.find((t) => t.name === variableName(v));

                      if (updated) {
                        const res = { static: updated };
                        updateVariable(res, v);
                        return res;
                      }

                      return v;
                    }),
                  },
                })
              }
              onMessageComposed={(message) => input({ message })}
            />
          </>
        )}
        {selectedTabType === 'message' && (
          <>
            <MsgInput
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
          loading={loading}
          onClick={async () => {
            if (name && reward && message) {
              onNext({ name, reward, message, template, selectedTabType, variables });
            }
          }}
        >
          {mode === 'basic' && template?.condition ? 'Save' : 'Next'}
        </Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </Footer>
    </Container>
  );
};
