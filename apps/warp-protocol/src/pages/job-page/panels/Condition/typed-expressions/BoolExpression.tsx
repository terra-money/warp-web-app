import { UIElementProps } from '@terra-money/apps/components';
import { Job } from 'types/job';
import { VariableValue } from './VariableValue';

export type BoolExpressionProps = {
  variableRef: string;
  job: Job;
} & UIElementProps;

export const BoolExpression = (props: BoolExpressionProps) => {
  const { variableRef, className, job } = props;

  return (
    <span className={className}>
      <VariableValue variables={job.vars} variableRef={variableRef} />
    </span>
  );
};
