import { warp_controller } from 'types';
import { UIElementProps } from '@terra-money/apps/components';

export type QueryExpressionProps = {
  query: warp_controller.QueryExpr;
} & UIElementProps;

export const QueryExpression = (props: QueryExpressionProps) => {
  const { query, className } = props;

  return <span className={className}>{query.name}</span>;
};
