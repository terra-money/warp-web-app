import { warp_controller } from 'types';
import { useOperatorLabel } from '../useOperatorLabel';
import { QueryExpression } from './QueryExpression';
import { UIElementProps } from 'shared/components';

export type IntExpressionProps = {
  expression: warp_controller.GenExprFor_NumValueForInt128And_NumExprOpAnd_IntFnOpAnd_NumOp;
} & UIElementProps;

export const IntExpression = (props: IntExpressionProps) => {
  const { expression, className } = props;
  const operator = useOperatorLabel(expression.op);

  const left =
    'simple' in expression.left ? (
      expression.left.simple
    ) : 'query' in expression.left ? (
      <QueryExpression query={expression.left.query} />
    ) : undefined;

  const right =
    'simple' in expression.right ? (
      expression.right.simple
    ) : 'query' in expression.right ? (
      <QueryExpression query={expression.right.query} />
    ) : undefined;

  return (
    <span className={className}>
      Int: {left} {operator} {right}
    </span>
  );
};
