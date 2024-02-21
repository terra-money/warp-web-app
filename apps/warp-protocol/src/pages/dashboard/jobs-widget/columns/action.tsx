import classNames from 'classnames';
import { TableCellProps } from 'react-virtualized';

import styles from './columns.module.sass';
import { useCallback } from 'react';
import { MenuAction } from 'components/menu-button/MenuAction';
import { useEditJobDialog } from '../dialogs/edit-job';
import { useExecuteJobDialog } from '../dialogs/execute-job/ExecuteJobDialog';
import { useCancelJobDialog } from '../dialogs/cancel-job/CancelJobDialog';
import { Job } from 'types/job';
import { useNavigate } from 'react-router';
import { useLocalWallet } from '@terra-money/apps/hooks';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useJobStorage } from 'pages/job-new/useJobStorage';
import { DropdownMenu } from 'components/dropdown-menu/DropdownMenu';

export const ActionCellRenderer = (cellProps: TableCellProps) => {
  const job = cellProps.rowData as Job;

  const openEditJobDialog = useEditJobDialog();
  const openExecuteJobDialog = useExecuteJobDialog();
  const openCancelJobDialog = useCancelJobDialog();
  const navigate = useNavigate();

  const localWallet = useLocalWallet();
  const { saveJob } = useJobStorage();

  const connectedWallet = localWallet.connectedWallet;
  const isCreator = connectedWallet && job.info.owner === connectedWallet.walletAddress;

  const onViewJob = useCallback(() => navigate(`/jobs/${job.info.id}`), [navigate, job]);
  const onEditJob = useCallback(() => openEditJobDialog({ job }), [openEditJobDialog, job]);
  const onExecuteJob = useCallback(() => openExecuteJobDialog({ job }), [openExecuteJobDialog, job]);
  const onCancelJob = useCallback(() => openCancelJobDialog({ job }), [openCancelJobDialog, job]);
  const onCloneJob = useCallback(() => {
    saveJob(job);
    navigate(`/job-new/details`);
  }, [navigate, job, saveJob]);

  return (
    <DropdownMenu
      menuClass={styles.menu}
      className={classNames(styles.col, styles.col_action)}
      action={<MoreVertIcon key={cellProps.dataKey} className={styles.menu_btn} />}
    >
      <MenuAction onClick={onViewJob}>View details</MenuAction>
      {isCreator && job.info.status === 'Pending' && <MenuAction onClick={onEditJob}>Edit job</MenuAction>}
      {job.info.status === 'Pending' && connectedWallet && <MenuAction onClick={onExecuteJob}>Execute job</MenuAction>}
      {isCreator && job.info.status === 'Pending' && <MenuAction onClick={onCancelJob}>Cancel job</MenuAction>}
      {connectedWallet && <MenuAction onClick={onCloneJob}>Clone job</MenuAction>}
    </DropdownMenu>
  );
};
