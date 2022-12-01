import { warp_controller } from 'types';
import { useOperatorLabel } from '../useOperatorLabel';
import { Container, UIElementProps } from '@terra-money/apps/components';
import { useBlockHeightQuery } from '../../../../../queries/useBlockHeightQuery';

export type BlockHeightExpressionProps = {
  expression: warp_controller.BlockExpr;
} & UIElementProps;

export const BlockHeightExpression = (props: BlockHeightExpressionProps) => {
  const { expression, className } = props;
  const operator = useOperatorLabel(expression.op);
  const { data } = useBlockHeightQuery();

  const height = data?.toString();

  return (
    <Container direction={'row'} className={className}>
      <span>
        Block height {height} {operator} {expression.comparator}
      </span>
    </Container>
  );
};
