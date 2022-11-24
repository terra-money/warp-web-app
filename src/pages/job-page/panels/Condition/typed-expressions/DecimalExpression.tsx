import { warp_controller } from 'types';
import { useOperatorLabel } from '../useOperatorLabel';
import { QueryExpression } from './QueryExpression';
import { UIElementProps } from 'shared/components';

export type DecimalExpressionProps = {
  expression: warp_controller.GenExprFor_NumValueFor_Decimal256And_NumExprOpAnd_DecimalFnOpAnd_NumOp;
} & UIElementProps;

export const DecimalExpression = (props: DecimalExpressionProps) => {
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
      Decimal: {left} {operator} {right}
    </span>
  );
};
