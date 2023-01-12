import { Job } from 'types/job';
import { Container, UIElementProps } from '@terra-money/apps/components';
import { Button, Text } from '../../../components/primitives';
import { Panel } from '../../../components/panel';
import { useCopy } from '../../../hooks';
import classNames from 'classnames';

import styles from './JobMessagePanel.module.sass';
import { decodedMsgs } from 'pages/job-new/useJobStorage';

export type JobMessagePanelProps = {
  job: Job;
} & UIElementProps;

export const JobMessagePanel = (props: JobMessagePanelProps) => {
  const { job, className } = props;
  const copy = useCopy('message', JSON.stringify(decodedMsgs(job), null, 2));
  // TODO: maybe JSON.parse before copying in case commas appear
  const copyRaw = useCopy('message', JSON.stringify(job.info.msgs, null, 2));

  return (
    <Panel className={classNames(styles.root, className)}>
      <Container className={styles.top} direction="row">
        <Text variant="label">Message</Text>
        <Container className={styles.btns}>
          <Button variant="secondary" onClick={copyRaw}>
            Raw
          </Button>
          <Button variant="secondary" onClick={copy}>
            Copy
          </Button>
        </Container>
      </Container>
      <pre className={styles.message}>{JSON.stringify(decodedMsgs(job), null, 4)}</pre>
    </Panel>
  );
};
