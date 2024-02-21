import { Job } from 'types/job';
import { Container, UIElementProps } from '@terra-money/apps/components';
import { Button, Text } from '../../../components/primitives';
import { Panel } from '../../../components/panel';
import { useCopy } from '../../../hooks';
import classNames from 'classnames';

import styles from './JobMessagePanel.module.sass';
import { useEffect, useState } from 'react';
import { decodeMsgs } from 'pages/job-new/JobNew';
import { EditorInput } from 'forms/QueryExprForm/EditorInput';

export type JobMessagePanelProps = {
  job: Job;
} & UIElementProps;

type TabType = 'encoded' | 'decoded';
const tabTypes = ['encoded', 'decoded'] as TabType[];

export const JobMessagePanel = (props: JobMessagePanelProps) => {
  const { job, className } = props;
  const [selectedTabType, setSelectedTabType] = useState<TabType>('encoded');

  const [msgs, setMsgs] = useState<any[]>(job.msgs);
  const copy = useCopy('message', JSON.stringify(msgs, null, 2));

  useEffect(() => {
    if (selectedTabType === 'encoded') {
      setMsgs(job.msgs);
    }

    if (selectedTabType === 'decoded') {
      setMsgs(decodeMsgs(job.msgs));
    }
  }, [job.msgs, selectedTabType]);

  return (
    <Panel className={classNames(styles.root, className)}>
      <Container className={styles.top} direction="row">
        <Text variant="label">Message</Text>
        <Container className={styles.btns}>
          <Container className={styles.tabs} direction="row">
            {tabTypes.map((tabType) => (
              <Button
                key={tabType}
                className={classNames(styles.tab, tabType === selectedTabType && styles.selected_tab)}
                onClick={() => setSelectedTabType(tabType)}
                variant="secondary"
              >
                {tabType}
              </Button>
            ))}
          </Container>
          <Button variant="secondary" onClick={copy}>
            Copy
          </Button>
        </Container>
      </Container>
      <EditorInput
        rootClassName={styles.msg}
        className={styles.msg_editor}
        value={JSON.stringify(msgs, null, 2)}
        readOnly={true}
      />
    </Panel>
  );
};
