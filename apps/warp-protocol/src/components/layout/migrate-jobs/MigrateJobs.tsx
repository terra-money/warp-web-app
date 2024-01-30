import { useMemo } from 'react';
import { Button, Text, Throbber } from 'components/primitives';
import { FixedSizeList } from 'react-window';
import { DialogProps, useDialog, useLocalWallet } from '@terra-money/apps/hooks';
import classNames from 'classnames';
import { Dialog, DialogBody, DialogHeader } from 'components/dialog';
import { ListData } from './ListData';
import { ListItem } from './ListItem';
import styles from './MigrateJobs.module.sass';
import { pluralize } from '@terra-money/apps/utils';
import { Container } from '@terra-money/apps/components';
import { useJobsQuery } from 'queries';
import { useJobsQueryv2 } from 'queries/useJobsQueryv2';
import { useMigrateFundsDialog } from './migrate-funds/MigrateFundsDialog';

const MigrateJobsDialog = (props: DialogProps<void, string>) => {
  const { closeDialog } = props;

  const { walletAddress } = useLocalWallet();

  const { data: jobsv1 = [], isLoading: isJobsv1sLoading } = useJobsQuery({
    owner: walletAddress,
  });

  const { data: jobsv2 = [], isLoading: isJobsv2Loading } = useJobsQueryv2({
    owner: walletAddress,
  });

  const listData = useMemo<ListData>(() => {
    const jobIdRegex = /^Migrated from v1 jobId: (\d+)$/;

    const migratedIds = jobsv2
      .map((job) => {
        const match = job.description.match(jobIdRegex);
        return match ? match[1] : null;
      })
      .filter((jobId) => jobId !== null); // Filter out null values

    const jobs = jobsv1.filter((job) => migratedIds.includes(job.info.id));

    return {
      jobs,
    };
  }, [jobsv1, jobsv2]);

  const isLoading = isJobsv1sLoading || isJobsv2Loading;

  const openMigrateFundsDialog = useMigrateFundsDialog();

  return (
    <Dialog>
      <DialogHeader title="Migrate jobs" onClose={() => closeDialog(undefined)} />
      <DialogBody className={styles.container}>
        <Container
          className={classNames(styles.columns, {
            [styles.hide]: isLoading,
          })}
          direction="row"
        >
          <Text variant="label">{`Displaying ${listData.jobs.length} ${pluralize('job', listData.jobs.length)}`}</Text>
          <Button
            className={styles.migrate_funds}
            iconGap="none"
            variant="primary"
            onClick={() => openMigrateFundsDialog({})}
          >
            Migrate funds
          </Button>
        </Container>
        {isLoading && <Throbber className={styles.throbber} />}
        {isLoading === false && (
          <FixedSizeList<ListData>
            className={styles.list}
            itemData={listData}
            height={300}
            width={520}
            itemSize={60}
            itemCount={listData.jobs.length}
            overscanCount={5}
          >
            {ListItem}
          </FixedSizeList>
        )}
      </DialogBody>
    </Dialog>
  );
};

export const useMigrateJobsDialog = () => {
  return useDialog(MigrateJobsDialog);
};
