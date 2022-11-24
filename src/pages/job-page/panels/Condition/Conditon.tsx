import { warp_controller } from 'types';
import { UIElementProps } from 'shared/components';
import { ConditionTree } from './ConditionTree';
import { Expression } from './Expression';
import classNames from 'classnames';
import styles from './Condition.module.sass';
import { Text } from 'components/primitives';

export type ConditionProps = {
  condition: warp_controller.Condition;
  isRoot?: boolean;
} & UIElementProps;

export const Condition = (props: ConditionProps) => {
  const { condition, className, isRoot } = props;

  if ('or' in condition) {
    return (
      <ConditionTree
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
        <Expression expression={condition.expr} />
      </li>
    );
  }

  return null;
};
