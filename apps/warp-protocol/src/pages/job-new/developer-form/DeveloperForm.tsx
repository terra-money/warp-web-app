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

type DeveloperFormProps = UIElementProps & {};

export const DeveloperForm = (props: DeveloperFormProps) => {
  const { className } = props;

  const [input, { message, messageError, submitDisabled }] = useDeveloperForm();

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
          must be present in your Warp account balance at the moment of execution.
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
      </Form>
      <Footer>
        <Button
          variant="primary"
          disabled={submitDisabled}
          loading={txResult.loading}
          onClick={async () => {
            if (message) {
              const resp = await createJobTx(JSON.parse(message));

              if (resp.success) {
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
