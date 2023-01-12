import styles from './ConditionTree.module.sass';
import { warp_controller } from 'types';

import { Condition } from './Conditon';
import { ReactNode } from 'react';
import { UIElementProps } from '@terra-money/apps/components';
import classNames from 'classnames';
import { Job } from 'types/job';

export type ConditionTreeProps = {
  title: ReactNode;
  items: warp_controller.Condition[];
  isRoot?: boolean;
  job: Job;
} & UIElementProps;

export const ConditionTree = (props: ConditionTreeProps) => {
  const { title, items, className, isRoot, job } = props;

  return (
    <div className={classNames(className, { [styles.item]: !isRoot })}>
      <li className={classNames(styles.tree_label, { [styles.first_label]: isRoot })}>{title}</li>
      <ul className={styles.list}>
        {items.map((item, index) => (
          <Condition className={styles.item} condition={item} job={job} />
        ))}
      </ul>
    </div>
  );
};
