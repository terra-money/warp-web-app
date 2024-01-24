import { Container, Form, UIElementProps } from '@terra-money/apps/components';
import { Button, Link, Text } from 'components/primitives';
import classNames from 'classnames';
import styles from './SummaryForm.module.sass';
import { FormControl } from 'components/form-control/FormControl';
import { useCachedVariables } from '../useCachedVariables';
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
import { JobMessagePanel } from 'pages/job-page/panels/JobMessagePanel';
import { JobConditionsPanel } from 'pages/job-page/panels/JobConditionsPanel';
import { TokenAmount } from 'components/token-amount';
import { u } from '@terra-money/apps/types';
import Big from 'big.js';
import { useNativeToken } from 'hooks/useNativeToken';

type SummaryFormProps = UIElementProps & {};

export const SummaryForm = (props: SummaryFormProps) => {
  const { className } = props;

  const { variables } = useCachedVariables();

  const { detailsInput, cond } = useJobStorage();

  const [txResult, createJobTx] = useCreateJobTx();

  const navigate = useNavigate();

  const sdk = useWarpSdk();

  const { walletAddress } = useLocalWallet();

  const [reward, setReward] = useState<string>();
  const [operationalAmount, setOperationalAmount] = useState<string>();

  const nativeToken = useNativeToken();

  useEffect(() => {
    const cb = async () => {
      const { durationDays, recurring, message } = detailsInput!;
      const msgs = parseMsgs(message);
      const condition = cond!;
      const executions = [{ condition, msgs }];
      const vars = filterUnreferencedVariables(variables, msgs, condition);

      const orderedVars = orderVarsByReferencing(vars);

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
      </Container>
      <Container className={styles.middle} direction="column">
        <FormControl labelVariant="secondary" label="Name" className={styles.name}>
          <Text variant="text" className={styles.text}>
            {detailsInput?.name}
          </Text>
        </FormControl>
        <FormControl labelVariant="secondary" label="Description" className={styles.description}>
          <Text variant="text" className={styles.text}>
            {!detailsInput?.description ? '--' : detailsInput.description}
          </Text>
        </FormControl>
        <FormControl labelVariant="secondary" label="Duration (in days)" className={styles.durationDays}>
          <Text variant="text" className={styles.text}>
            {detailsInput?.durationDays}
          </Text>
        </FormControl>
        <FormControl labelVariant="secondary" label="Recurring" className={styles.recurring}>
          <Text variant="text" className={styles.text}>
            {detailsInput?.recurring ? 'Yes' : 'No'}
          </Text>
        </FormControl>
        <FormControl labelVariant="secondary" label="Reward" className={styles.reward}>
          {reward ? (
            <TokenAmount
              className={styles.text}
              variant="text"
              decimals={2}
              token={nativeToken}
              amount={Big(reward) as u<Big>}
              showSymbol={true}
              showUsdAmount={true}
            />
          ) : (
            <Text variant="text" className={styles.text}>
              Estimating...
            </Text>
          )}
        </FormControl>
        <FormControl labelVariant="secondary" label="Total cost (fees + reward)" className={styles.operational_amount}>
          {operationalAmount ? (
            <TokenAmount
              className={styles.text}
              variant="text"
              decimals={2}
              token={nativeToken}
              amount={Big(operationalAmount) as u<Big>}
              showSymbol={true}
              showUsdAmount={true}
            />
          ) : (
            <Text variant="text" className={styles.text}>
              Estimating...
            </Text>
          )}
        </FormControl>

        <JobMessagePanel
          className={styles.message}
          job={{ msgs: parseMsgs(detailsInput?.message!) } as unknown as Job}
        />
        <JobConditionsPanel
          className={styles.condition}
          job={{ condition: cond!, vars: variables } as unknown as Job}
        />
      </Container>

      <Footer>
        <Button
          variant="primary"
          loading={txResult.loading}
          disabled={!reward || !operationalAmount}
          onClick={async () => {
            if (detailsInput && operationalAmount && reward) {
              const { name, message, description, recurring, durationDays, fundingAccount } = detailsInput;

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
                fundingAccount,
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
