import { UIElementProps } from '@terra-money/apps/components';
import { Job } from 'types/job';
import { warp_resolver } from '@terra-money/warp-sdk';
import { VariableValue } from './VariableValue';

type ExprValue =
  | warp_resolver.ValueFor_String
  | warp_resolver.NumValueFor_Uint256And_NumExprOpAnd_IntFnOp
  | warp_resolver.NumValueFor_Decimal256And_NumExprOpAnd_DecimalFnOp
  | warp_resolver.NumValueForInt128And_NumExprOpAnd_IntFnOp;

export type ExpressionValueProps = {
  value: ExprValue;
  job: Job;
} & UIElementProps;

export const ExpressionValue = (props: ExpressionValueProps) => {
  const { job, value } = props;

  let left = <></>;

  if ('simple' in value) {
    left = <>{value.simple}</>;
  }

  if ('ref' in value) {
    left = <VariableValue variables={job.vars} variableRef={value.ref} />;
  }

  if ('env' in value) {
    left = <>{value.env}</>;
  }

  return left;
};
