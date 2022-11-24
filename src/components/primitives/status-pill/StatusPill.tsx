import { UIElementProps } from 'shared/components';
import classNames from 'classnames';
import { Button } from '../button';
import { ReactComponent as CheckIcon } from 'components/assets/Check.svg';
import { ReactComponent as CloseIcon } from 'components/assets/Close.svg';
import { ReactComponent as ExcalamationIcon } from 'components/assets/Exclamation.svg';
import { ReactComponent as HourglassIcon } from 'components/assets/Hourglass.svg';

import styles from './StatusPill.module.sass';
import { warp_controller } from 'types';

type StatusPillProps = UIElementProps & {
  status: warp_controller.JobStatus;
};

const icon = (status: warp_controller.JobStatus) => {
  switch (status) {
    case 'Cancelled':
      return <CloseIcon className={styles.cancelled_icon} />;
    case 'Executed':
      return <CheckIcon className={styles.executed_icon} />;
    case 'Failed':
      return <ExcalamationIcon className={styles.failed_icon} />;
    case 'Pending':
      return <HourglassIcon className={styles.pending_icon} />;
  }
};

export const StatusPill = ({ className, status }: StatusPillProps) => {
  return (
    <Button
      className={classNames(styles.root, className, styles[`root_${status.toLowerCase()}`])}
      iconGap="none"
      icon={icon(status)}
    />
  );
};
