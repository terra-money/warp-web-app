import styles from './Dashboard.module.sass';
import { Container } from 'shared/components';
import { Analytics } from './analytics/Analytics';
import { JobsWidget } from './jobs-widget/JobsWidget';
import { Text } from 'components/primitives';

export const Dashboard = () => {
  return (
    <Container direction="column" className={styles.root}>
      <Text variant="heading1" className={styles.title}>
        Dashboard
      </Text>
      <Analytics className={styles.analytics} />
      <JobsWidget className={styles.jobs} showExpand={true} />
    </Container>
  );
};
