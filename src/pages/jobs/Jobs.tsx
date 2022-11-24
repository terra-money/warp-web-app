import styles from './Jobs.module.sass';
import { Container } from 'shared/components';
import { JobsWidget } from 'pages/dashboard/jobs-widget/JobsWidget';
import { Text } from 'components/primitives';

export const Jobs = () => {
  return (
    <Container direction="column" className={styles.root}>
      <Text variant="heading1" className={styles.title}>
        Jobs
      </Text>
      <JobsWidget />
    </Container>
  );
};
