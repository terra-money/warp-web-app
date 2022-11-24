import { warp_controller } from '../../../../../types';
import { useOperatorLabel } from '../useOperatorLabel';
import { format } from 'date-fns';
import { UIElementProps } from 'shared/components';

export type BlockHeightExpressionProps = {
  expression: warp_controller.TimeExpr;
} & UIElementProps;

const toDate = (timestamp: string) => new Date(Number(timestamp) * 1000);

export const TimestampExpression = (props: BlockHeightExpressionProps) => {
  const { expression, className } = props;
  const operator = useOperatorLabel(expression.op);

  return (
    <span className={className}>
      Time {operator} {format(toDate(expression.comparator), 'dd MMM yyyy p')}
    </span>
  );
};
