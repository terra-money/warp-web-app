import { Container, UIElementProps } from '@terra-money/apps/components';
import classNames from 'classnames';
import { Form } from 'components/form/Form';
import { Button, Link, Text } from 'components/primitives';
import { useNavigate } from 'react-router';
import { Footer } from '../footer/Footer';
import styles from './DeveloperForm.module.sass';
import { useDeveloperForm } from './useDeveloperForm';
import { MsgInput } from 'forms/QueryExprForm/MsgInput';
import { useCallback } from 'react';
import { useCreateDevJobTx } from 'tx';
import { warp_controller } from '@terra-money/warp-sdk';
import { TokenInput } from 'pages/balances/token-input/TokenInput';
import { AmountInput } from 'pages/dashboard/jobs-widget/inputs/AmountInput';
import { demicrofy, microfy } from '@terra-money/apps/libs/formatting';
import Big from 'big.js';

type DeveloperFormProps = UIElementProps & {};

export const DeveloperForm = (props: DeveloperFormProps) => {
  const { className } = props;

  const [
    input,
    { message, messageError, submitDisabled, amount, amountError, amountValid, token, balance, balanceLoading },
  ] = useDeveloperForm();

  const navigate = useNavigate();

  const onDocsClick = useCallback(() => {
    window.open('https://docs.warp.money');
  }, []);

  const [txResult, createJobTx] = useCreateDevJobTx();

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
          Below you may enter job information as complete JSON payload. Any tokens sent as part of the job's message
          must be present in your wallet, including fees. In case a funding account is set, it will be used to pay for
          fees.
        </Text>
      </Container>
      <Form className={styles.form}>
        <MsgInput
          rootClassName={styles.msg_input}
          label="Create job payload"
          placeholder="Type a payload"
          className={styles.msg_input_inner}
          error={messageError}
          valid
          example={null}
          value={message}
          onChange={(value) => input({ message: value })}
        />
        <TokenInput
          className={styles.token_input}
          label="Token"
          value={token}
          onChange={(token) => {
            input({ token });
          }}
        />

        <AmountInput
          label="Amount"
          className={styles.amount_input}
          value={amount}
          onChange={(value) =>
            input({
              amount: value.target.value,
            })
          }
          onBalanceClick={(value) => {
            if (token) {
              input({
                amount: demicrofy(value, token?.decimals).toString(),
              });
            }
          }}
          error={amountError}
          balance={balance}
          balanceLoading={balanceLoading}
          token={token}
          valid={amountValid}
        />
      </Form>
      <Footer>
        <Button
          variant="primary"
          disabled={submitDisabled}
          loading={txResult.loading}
          onClick={async () => {
            if (message) {
              const createJobMsg: warp_controller.CreateJobMsg = JSON.parse(message);

              let parsedAmount = token && amount ? microfy(Big(amount), token?.decimals) : undefined;

              const resp = await createJobTx({ createJobMsg, token, amount: parsedAmount });

              if (resp.code !== 0) {
                navigate('/jobs');
              }
            }
          }}
        >
          Save
        </Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Text className={styles.eviction_warning} variant="label">
          Jobs not executed within the eviction period will have a minimal fee deducted from it's reward and returned to
          queue.
          <Link className={styles.link} onClick={onDocsClick}>
            Docs
          </Link>
        </Text>
      </Footer>
    </Container>
  );
};
