import { UIElementProps } from '@terra-money/apps/components';
import { ConditionTree } from './ConditionTree';
import { Expression } from './Expression';
import classNames from 'classnames';
import styles from './Condition.module.sass';
import { Text } from 'components/primitives';
import { Job } from 'types/job';
import { warp_resolver } from '@terra-money/warp-sdk';

export type ConditionProps = {
  condition: warp_resolver.Condition;
  isRoot?: boolean;
  job: Job;
} & UIElementProps;

export const Condition = (props: ConditionProps) => {
  const { condition, className, isRoot, job } = props;

  if ('or' in condition) {
    return (
      <ConditionTree
        job={job}
        isRoot={isRoot}
        className={className}
        items={condition.or}
        title={
          <Text variant={'text'} className={styles.tree_title}>
            <b>ANY</b> of the following must be true
          </Text>
        }
      />
    );
  }

  if ('and' in condition) {
    return (
      <ConditionTree
        job={job}
        isRoot={isRoot}
        className={className}
        items={condition.and}
        title={
          <Text variant={'text'} className={styles.tree_title}>
            <b>ALL</b> of the following must be true
          </Text>
        }
      />
    );
  }

  if ('not' in condition) {
    return (
      <ConditionTree
        job={job}
        isRoot={isRoot}
        className={className}
        title={
          <Text variant={'text'} className={styles.tree_title}>
            The following must <b>NOT</b> be true
          </Text>
        }
        items={[condition.not]}
      />
    );
  }

  if ('expr' in condition) {
    return (
      <li className={classNames(className, styles.expression_item)}>
        <Expression expression={condition.expr} job={job} />
      </li>
    );
  }

  return null;
};
