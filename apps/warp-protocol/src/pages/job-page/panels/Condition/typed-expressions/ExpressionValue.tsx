import { UIElementProps } from '@terra-money/apps/components';
import { Job } from 'types/job';
import { warp_controller } from 'types';
import { VariableValue } from './VariableValue';

type ExprValue =
  | warp_controller.ValueFor_String
  | warp_controller.NumValueFor_Uint256And_NumExprOpAnd_IntFnOp
  | warp_controller.NumValueFor_Decimal256And_NumExprOpAnd_DecimalFnOp
  | warp_controller.NumValueForInt128And_NumExprOpAnd_IntFnOp;

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
    left = <VariableValue job={job} variableRef={value.ref} />;
  }

  return left;
};
