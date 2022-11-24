import { warp_controller } from '../../../../../types';
import { QueryExpression } from './QueryExpression';
import { UIElementProps } from 'shared/components';

export type BoolExpressionProps = {
  expression: warp_controller.QueryExpr;
} & UIElementProps;

export const BoolExpression = (props: BoolExpressionProps) => {
  const { expression, className } = props;

  return (
    <span className={className}>
      <QueryExpression query={expression} /> is true
    </span>
  );
};
