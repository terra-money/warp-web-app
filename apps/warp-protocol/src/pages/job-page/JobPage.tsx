import styles from './JobPage.module.sass';
import { Container, UIElementProps } from '@terra-money/apps/components';
import { Link, Text, Throbber } from 'components/primitives';
import { useParams } from 'react-router';
import { useJobQuery } from 'queries/useJobQuery';
import { Job } from 'types/job';
import { JobDetailsPanel } from './panels/JobDetailsPanel';
import { JobMessagePanel } from './panels/JobMessagePanel';
import { JobConditionsPanel } from './panels/JobConditionsPanel';
import { CachedVariablesSession } from 'pages/job-new/CachedVariablesSession';
import { VariableDrawer } from 'pages/job-new/variable-drawer/VariableDrawer';

const JobContent = (props: { job: Job }) => {
  const { job } = props;

  return (
    <CachedVariablesSession input={job.vars}>
      <Container direction="column" className={styles.content}>
        <Container className={styles.title_container}>
          <Text variant="heading1" className={styles.title}>
            {job.info.name}
          </Text>
          <Link className={styles.back} to={-1}>
            Back
          </Link>
        </Container>
        <Container className={styles.bottom} direction="row">
          <JobDetailsPanel job={job} className={styles.left} />
          <JobMessagePanel job={job} className={styles.middle} />
          <JobConditionsPanel job={job} className={styles.right} />
          <VariableDrawer readOnly={true} open={false} />
        </Container>
      </Container>
    </CachedVariablesSession>
  );
};

export const JobPage = (props: UIElementProps) => {
  const { jobId } = useParams();
  const { data: job, isLoading } = useJobQuery(jobId);

  return (
    <Container direction="column" className={styles.root}>
      {jobId === undefined || job === undefined || isLoading ? (
        <Throbber className={styles.loading} />
      ) : (
        <JobContent job={job} />
      )}
    </Container>
  );
};
