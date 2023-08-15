import { UIElementProps } from '@terra-money/apps/components';
import { Job } from 'types/job';
import { FormControl } from 'components/form-control/FormControl';
import { Text } from 'components/primitives';
import { TokenAmount } from 'components/token-amount';
import { Panel } from 'components/panel';
import styles from './JobDetailsPanel.module.sass';
import classNames from 'classnames';
import { format } from 'date-fns';
import { useCopy } from 'hooks';
import { useNativeToken } from 'hooks/useNativeToken';

export type JobDetailsPanelProps = {
  job: Job;
} & UIElementProps;

export const JobDetailsPanel = (props: JobDetailsPanelProps) => {
  const { job, className } = props;

  const copy = useCopy('address', job.info.owner);

  const nativeToken = useNativeToken();

  return (
    <Panel className={classNames(styles.root, className)}>
      <FormControl labelVariant="secondary" label="#ID">
        <Text variant="text" className={styles.id}>
          {job.info.id}
        </Text>
      </FormControl>
      <FormControl labelVariant="secondary" label="Name">
        <Text variant="text" className={styles.name}>
          {job.info.name}
        </Text>
      </FormControl>
      <FormControl labelVariant="secondary" label="Reward">
        <TokenAmount
          className={styles.reward}
          variant="text"
          decimals={2}
          token={nativeToken}
          amount={job.reward}
          showSymbol={true}
          showUsdAmount={true}
        />
      </FormControl>
      <FormControl labelVariant="secondary" label="Status">
        <Text variant="text" className={styles.status}>
          {job.info.status}
        </Text>
      </FormControl>
      <FormControl labelVariant="secondary" label="Creator">
        <Text variant="text" className={styles.creator} onClick={copy}>
          {job.info.owner}
        </Text>
      </FormControl>
      <FormControl labelVariant="secondary" label="Description">
        <Text variant="text" className={styles.description}>
          {job.info.description ?? '-'}
        </Text>
      </FormControl>
      <FormControl labelVariant="secondary" label="Last update">
        <Text variant="text" className={styles.lastUpdated}>
          {format(new Date(Number(job.info.last_update_time) * 1000), 'dd MMM yyyy p')}
        </Text>
      </FormControl>
    </Panel>
  );
};
