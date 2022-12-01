import { UIElementProps } from '@terra-money/apps/components';
import { Job } from 'types/job';
import { FormControl } from 'components/form-control/FormControl';
import { Text } from 'components/primitives';
import { TokenAmount } from 'components/token-amount';
import { truncateAddress } from '@terra-money/apps/utils';
import { Panel } from 'components/panel';
import styles from './JobDetailsPanel.module.sass';
import classNames from 'classnames';
import { LUNA } from '@terra-money/apps/types';

export type JobDetailsPanelProps = {
  job: Job;
} & UIElementProps;

export const JobDetailsPanel = (props: JobDetailsPanelProps) => {
  const { job, className } = props;

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
          token={LUNA}
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
        <Text variant="text" className={styles.creator}>
          {truncateAddress(job.info.owner, [8, 8])}
        </Text>
      </FormControl>
    </Panel>
  );
};
