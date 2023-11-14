import { UIElementProps } from '@terra-money/apps/components';
import { useEffect, useMemo, useState } from 'react';
import { ReactComponent as PlusIcon } from 'components/assets/Plus.svg';
import { Sort, TableWidget, TopBar, Actions } from 'components/table-widget';
import { SortBy } from './utils';
import { EmptyView } from './EmptyView';
import { ActionButton } from 'components/action-button/ActionButton';
import styles from './JobsWidget.module.sass';
import { jobWidgetColumns } from './columns';
import { Button, Link, Text } from 'components/primitives';
import { useJobsQuery } from 'queries/useJobsQuery';
import { Job } from 'types/job';
import { useJobFiltersDialog } from './dialogs/job-filters/JobFiltersDialog';
import { warp_controller } from '@terra-money/warp-sdk';
import { useNewJobDialog } from 'components/layout/dialogs/NewJobDialog';

type JobsWidgetProps = {
  limit?: number;
  showExpand?: boolean;
} & UIElementProps;

type PageIndexMap = {
  // Index of last item on each page
  [page: number]: warp_controller.JobIndex;
};

export const JobsWidget = (props: JobsWidgetProps) => {
  const { className, limit = 20, showExpand } = props;

  const [sort, setSort] = useState<Sort<SortBy>>();
  const [queryOpts, setQueryOpts] = useState<warp_controller.QueryJobsMsg>({ job_status: 'Pending' });
  const [page, setPage] = useState(1);

  const [lastItemIndexes, setLastItemIndexes] = useState<PageIndexMap>({});
  const start_after = useMemo(() => lastItemIndexes[page - 1], [page, lastItemIndexes]);
  const allOpts = useMemo(() => ({ ...queryOpts, start_after, limit }), [queryOpts, start_after, limit]);
  const { isLoading, data = [] } = useJobsQuery(allOpts);

  // After fetching the current page, fetch the next page using last item of current page
  const preloadOpts = useMemo(() => {
    const index = lastItemIndexes[page];

    // If the index is undefined, that means current page is not loaded or empty
    // In that case don't make the request to preload next page
    const enabled = Boolean(index);

    return { ...queryOpts, start_after: index, limit, enabled };
  }, [lastItemIndexes, page, queryOpts, limit]);

  const { data: nextPageData = [] } = useJobsQuery(preloadOpts);
  const hasNextPage = useMemo(() => nextPageData?.length > 0, [nextPageData]);

  // When the data for the page is fully loaded, generate and record a JobIndex for the last item on the page
  useEffect(() => {
    if (!isLoading && data && data.length && !lastItemIndexes[page]) {
      const lastItem = data[data.length - 1];
      const index = { _0: lastItem.info.reward, _1: lastItem.info.id };

      const newIndexMap = { ...lastItemIndexes };
      newIndexMap[page] = index;

      setLastItemIndexes(newIndexMap);
    }
  }, [isLoading, data, lastItemIndexes, page]);

  const openJobFiltersDialog = useJobFiltersDialog();

  const columns = useMemo(() => {
    return jobWidgetColumns({ sort, setSort });
  }, [sort, setSort]);

  const statusFilter = queryOpts.job_status;

  const openNewJobDialog = useNewJobDialog();

  return (
    <TableWidget<Job>
      className={className}
      columns={columns}
      data={data}
      paginated={true}
      page={page}
      setPage={setPage}
      hasNextPage={hasNextPage}
      isLoading={isLoading}
      emptyView={<EmptyView />}
      topBar={
        <TopBar className={styles.top_bar}>
          <Text variant="heading1" className={styles.title}>
            Jobs
            {showExpand && (
              <Link className={styles.expand} to="/jobs">
                Expand
              </Link>
            )}
          </Text>
          <Actions>
            <Button
              variant="secondary"
              className={styles.filters}
              onClick={async () => {
                const resp = await openJobFiltersDialog({ opts: queryOpts });

                if (resp) {
                  setLastItemIndexes({});
                  setQueryOpts(resp);
                }
              }}
            >
              <div className={styles.filters_inner}>
                <div className={styles.name}>Filters</div>
                {statusFilter && <div className={styles.status}>{statusFilter}</div>}
              </div>
            </Button>
            <ActionButton
              className={styles.new}
              icon={<PlusIcon className={styles.new_icon} />}
              iconGap="none"
              variant="primary"
              onClick={() => openNewJobDialog({})}
            >
              New
            </ActionButton>
          </Actions>
        </TopBar>
      }
    />
  );
};
