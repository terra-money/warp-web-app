import { warp_controller } from '../../../../../types';
import { UIElementProps } from '@terra-money/apps/components';
import { Job } from 'types/job';
import { VariableValue } from './VariableValue';

export type BoolExpressionProps = {
  expression: warp_controller.BoolExpr;
  job: Job;
} & UIElementProps;

export const BoolExpression = (props: BoolExpressionProps) => {
  const { expression, className, job } = props;

  return (
    <span className={className}>
      <VariableValue job={job} variableRef={expression.ref} />
    </span>
  );
};
