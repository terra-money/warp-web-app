import { warp_controller } from 'types';
import { useOperatorLabel } from '../useOperatorLabel';
import { UIElementProps } from '@terra-money/apps/components';
import { Job } from 'types/job';
import { ExpressionValue } from './ExpressionValue';

export type IntExpressionProps = {
  expression: warp_controller.GenExprFor_NumValueForInt128And_NumExprOpAnd_IntFnOpAnd_NumOp;
  job: Job;
} & UIElementProps;

export const IntExpression = (props: IntExpressionProps) => {
  const { expression, className, job } = props;
  const operator = useOperatorLabel(expression.op);

  const left = <ExpressionValue job={job} value={expression.left} />;
  const right = <ExpressionValue job={job} value={expression.right} />;

  return (
    <span className={className}>
      Int: {left} {operator} {right}
    </span>
  );
};
