import { warp_controller } from 'types';
import { useOperatorLabel } from '../useOperatorLabel';
import { QueryExpression } from './QueryExpression';
import { UIElementProps } from '@terra-money/apps/components';

export type StringExpressionProps = {
  expression: warp_controller.GenExprFor_ValueFor_StringAnd_StringOp;
} & UIElementProps;

export const StringExpression = (props: StringExpressionProps) => {
  const { expression, className } = props;
  const operator = useOperatorLabel(expression.op);

  const left = 'simple' in expression.left ? expression.left.simple : <QueryExpression query={expression.left.query} />;

  const right =
    'simple' in expression.right ? expression.right.simple : <QueryExpression query={expression.right.query} />;

  return (
    <span className={className}>
      String: {left} {operator} {right}
    </span>
  );
};
