import { Container, UIElementProps } from 'shared/components';
import { Job } from 'types/job';
import styles from './JobConditionsPanel.module.sass';
import { Text } from '../../../components/primitives';
import { Panel } from '../../../components/panel';
import classNames from 'classnames';
import { Condition } from './Condition/Conditon';

export type JobConditionsPanelProps = {
  job: Job;
} & UIElementProps;

export const JobConditionsPanel = (props: JobConditionsPanelProps) => {
  const { className, job } = props;

  return (
    <Panel className={classNames(styles.root, className)}>
      <Container className={styles.top} direction="row">
        <Text variant="label">Condition</Text>
      </Container>
      <Condition condition={job.info.condition} isRoot />
    </Panel>
  );
};
