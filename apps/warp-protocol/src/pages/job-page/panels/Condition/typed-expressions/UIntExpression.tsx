import { warp_controller } from 'types';
import { operatorLabel } from '../operatorLabel';
import { UIElementProps } from '@terra-money/apps/components';
import { Job } from 'types/job';
import { ExpressionValue } from './ExpressionValue';

export type UIntExpressionProps = {
  expression: warp_controller.GenExprFor_NumValueFor_Uint256And_NumExprOpAnd_IntFnOpAnd_NumOp;
  job: Job;
} & UIElementProps;

export const UIntExpression = (props: UIntExpressionProps) => {
  const { expression, className, job } = props;
  const operator = operatorLabel(expression.op);

  const left = <ExpressionValue job={job} value={expression.left} />;
  const right = <ExpressionValue job={job} value={expression.right} />;

  return (
    <span className={className}>
      UInt: {left} {operator} {right}
    </span>
  );
};
