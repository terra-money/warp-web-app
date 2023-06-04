import { warp_controller } from 'types';
import { operatorLabel } from '../operatorLabel';
import { Container, UIElementProps } from '@terra-money/apps/components';
import { useBlockHeightQuery } from '../../../../../queries/useBlockHeightQuery';
import { Job } from 'types/job';

export type BlockHeightExpressionProps = {
  expression: warp_controller.BlockExpr;
  job: Job;
} & UIElementProps;

export const BlockHeightExpression = (props: BlockHeightExpressionProps) => {
  const { expression, className } = props;
  const operator = operatorLabel(expression.op);
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
