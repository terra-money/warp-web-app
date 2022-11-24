import { Job } from 'types/job';
import { Container, UIElementProps } from 'shared/components';
import { Button, Text } from '../../../components/primitives';
import { Panel } from '../../../components/panel';
import { useCopy } from '../../../hooks';
import classNames from 'classnames';

import styles from './JobMessagePanel.module.sass';
import { decodeMsg } from 'pages/job-new/useJobStorage';

export type JobMessagePanelProps = {
  job: Job;
} & UIElementProps;

export const JobMessagePanel = (props: JobMessagePanelProps) => {
  const { job, className } = props;
  const copy = useCopy('message', JSON.stringify(job.info.msgs, null, 2));

  return (
    <Panel className={classNames(styles.root, className)}>
      <Container className={styles.top} direction="row">
        <Text variant="label">Message</Text>
        <Button variant="secondary" onClick={copy}>
          Copy
        </Button>
      </Container>
      <pre className={styles.message}>{JSON.stringify(job.info.msgs.map(decodeMsg), null, 4)}</pre>
    </Panel>
  );
};
