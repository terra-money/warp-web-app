import classNames from 'classnames';
import { TableCellProps } from 'react-virtualized';

import styles from './columns.module.sass';
import { useCallback } from 'react';
import { MenuButton } from 'components/menu-button';
import { MenuAction } from 'components/menu-button/MenuAction';
import { useEditJobDialog } from '../dialogs/edit-job';
import { useExecuteJobDialog } from '../dialogs/execute-job/ExecuteJobDialog';
import { useCancelJobDialog } from '../dialogs/cancel-job/CancelJobDialog';
import { Job } from 'types/job';
import { useNavigate } from 'react-router';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useJobStorage } from 'pages/job-new/useJobStorage';

export const ActionCellRenderer = (cellProps: TableCellProps) => {
  const job = cellProps.rowData as Job;

  const openEditJobDialog = useEditJobDialog();
  const openExecuteJobDialog = useExecuteJobDialog();
  const openCancelJobDialog = useCancelJobDialog();
  const navigate = useNavigate();

  const connectedWallet = useConnectedWallet();
  const { saveJob } = useJobStorage();

  const isCreator = connectedWallet && job.info.owner === connectedWallet.walletAddress;

  const onViewJob = useCallback(() => navigate(`/jobs/${job.info.id}`), [navigate, job]);
  const onEditJob = useCallback(() => openEditJobDialog({ job }), [openEditJobDialog, job]);
  const onExecuteJob = useCallback(() => openExecuteJobDialog({ job }), [openExecuteJobDialog, job]);
  const onCancelJob = useCallback(() => openCancelJobDialog({ job }), [openCancelJobDialog, job]);
  const onCloneJob = useCallback(() => {
    saveJob(job);
    navigate(`/job-new/details?mode=advanced`);
  }, [navigate, job, saveJob]);

  return (
    <MenuButton className={classNames(styles.col, styles.col_action)} key={cellProps.dataKey}>
      <MenuAction onClick={onViewJob}>View details</MenuAction>
      {isCreator && job.info.status === 'Pending' && <MenuAction onClick={onEditJob}>Edit job</MenuAction>}
      {job.info.status === 'Pending' && <MenuAction onClick={onExecuteJob}>Execute job</MenuAction>}
      {isCreator && job.info.status === 'Pending' && <MenuAction onClick={onCancelJob}>Cancel job</MenuAction>}
      <MenuAction onClick={onCloneJob}>Clone job</MenuAction>
    </MenuButton>
  );
};
