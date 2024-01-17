import { Container, Form, UIElementProps } from '@terra-money/apps/components';
import { Button, Link, Text } from 'components/primitives';
import classNames from 'classnames';
import styles from './SummaryForm.module.sass';
import { FormControl } from 'components/form-control/FormControl';
import { EditorInput } from 'forms/QueryExprForm/EditorInput';
import { useCachedVariables } from '../useCachedVariables';
import { Condition } from 'pages/job-page/panels/Condition/Conditon';
import { Job } from 'types/job';
import { Footer } from '../footer/Footer';
import { useNavigate } from 'react-router';
import { useJobStorage } from '../useJobStorage';
import { parseMsgs } from '../JobNew';
import { useCreateJobTx } from 'tx/useCreateJobTx';
import { filterUnreferencedVariables, orderVarsByReferencing } from 'utils/msgs';
import { useLocalWallet, useWarpSdk } from '@terra-money/apps/hooks';
import { useEffect, useState } from 'react';
import { composers } from '@terra-money/warp-sdk';

type SummaryFormProps = UIElementProps & {};

export const SummaryForm = (props: SummaryFormProps) => {
  const { className } = props;

  const { variables } = useCachedVariables();

  const { detailsInput, cond } = useJobStorage();

  const [txResult, createJobTx] = useCreateJobTx();

  const navigate = useNavigate();

  const sdk = useWarpSdk();

  const { walletAddress } = useLocalWallet();

  const [reward, setReward] = useState<string>('');
  const [operationalAmount, setOperationalAmount] = useState<string>('');

  useEffect(() => {
    const cb = async () => {
      const { durationDays, recurring, message } = detailsInput!;
      const executions = [{ condition: cond!, msgs: parseMsgs(message) }];
      const orderedVars = orderVarsByReferencing(variables);

      const estimateJobRewardMsg = composers.job
        .estimate()
        .recurring(recurring)
        .durationDays(durationDays)
        .vars(orderedVars)
        .executions(executions)
        .compose();

      const rewardEstimate = await sdk.estimateJobReward(walletAddress, estimateJobRewardMsg);

      const operationalAmountEstimate = await sdk.estimateJobFee(
        walletAddress,
        estimateJobRewardMsg,
        rewardEstimate.amount.toString()
      );

      setReward(rewardEstimate.amount.toString());
      setOperationalAmount(operationalAmountEstimate.amount.toString());
    };

    cb();
  }, [cond, detailsInput, sdk, variables, walletAddress]);

  return (
    <Form className={classNames(styles.root, className)}>
      <Container className={styles.title_container}>
        <Text variant="heading1" className={styles.title}>
          Job summary
        </Text>
        <Link className={styles.back} to={-1}>
          Back
        </Link>
        <Text className={styles.description} variant="label">
          Below you can overview information related to your Warp job.
        </Text>
      </Container>
      <Container className={styles.middle} direction="column">
        <FormControl label="Name" className={styles.form_control}>
          <Text variant="text">{detailsInput?.name}</Text>
        </FormControl>
        <FormControl label="Description" className={styles.form_control}>
          <Text variant="text">{detailsInput?.description}</Text>
        </FormControl>
        <FormControl label="Duration (in days)" className={styles.form_control}>
          <Text variant="text">{detailsInput?.durationDays}</Text>
        </FormControl>
        <FormControl label="Message" className={styles.form_control}>
          <EditorInput
            rootClassName={styles.msg}
            className={styles.msg_editor}
            value={JSON.stringify(detailsInput?.message, null, 2)}
            readOnly={true}
          />
        </FormControl>
        <FormControl label="Recurring" className={styles.form_control}>
          <Text variant="text">{detailsInput?.recurring ? 'Yes' : 'No'}</Text>
        </FormControl>
        <FormControl label="Condition" className={styles.form_control}>
          <Condition isRoot job={{ vars: variables } as Job} condition={cond!} />
        </FormControl>
      </Container>

      <Footer>
        <Button
          variant="primary"
          loading={txResult.loading}
          disabled={!reward || !operationalAmount}
          onClick={async () => {
            if (detailsInput) {
              const { name, message, description, recurring, durationDays } = detailsInput;

              const msgs = parseMsgs(message);

              const vars = filterUnreferencedVariables(variables, msgs, cond);

              const resp = await createJobTx({
                name,
                vars,
                description,
                msgs,
                recurring,
                condition: cond!,
                operationalAmount,
                reward,
                durationDays,
              });

              if (resp.code !== 0) {
                navigate('/jobs');
              }
            }
          }}
        >
          Save
        </Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Footer>
    </Form>
  );
};
