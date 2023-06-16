import { warp_controller } from '../../../../../types';
import { operatorLabel } from '../operatorLabel';
import { format } from 'date-fns';
import { UIElementProps } from '@terra-money/apps/components';
import { Job } from 'types/job';

export type BlockHeightExpressionProps = {
  expression: warp_controller.TimeExpr;
  job: Job;
} & UIElementProps;

const toDate = (timestamp: string) => new Date(Number(timestamp) * 1000);

export const TimestampExpression = (props: BlockHeightExpressionProps) => {
  const { expression, className } = props;
  const operator = operatorLabel(expression.op);

  return (
    <span className={className}>
      Time {operator} {format(toDate(expression.comparator), 'dd MMM yyyy p')}
    </span>
  );
};
