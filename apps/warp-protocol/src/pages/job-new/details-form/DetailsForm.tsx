import { InputAdornment } from '@mui/material';
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
import { DetailsFormInput, useDetailsForm } from './useDetailsForm';

type DetailsFormProps = UIElementProps & {
  onNext: (props: DetailsFormInput) => void;
  detailsInput?: DetailsFormInput;
};

export const DetailsForm = (props: DetailsFormProps) => {
  const { onNext, className, detailsInput } = props;

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

  const navigate = useNavigate();

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
        <FormControl label="Name">
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
        <WasmMsgInput
          className={styles.wasm_msg}
          label="Message"
          error={messageError}
          valid
          placeholder="Type your message here"
          value={message}
          onChange={(value) => input({ message: value })}
        />
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
