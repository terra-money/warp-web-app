import { UIElementProps } from '@terra-money/apps/components';
import { Job } from 'types/job';
import { warp_resolver } from '@terra-money/warp-sdk';
import { VariableValue } from '../../VariableValue';
import { operatorLabel } from '../../../operatorLabel';

type ExprValue =
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

  if ('expr' in value) {
    const operator = operatorLabel(value.expr.op);

    const l = <ExpressionValue job={job} value={value.expr.left} />;
    const r = <ExpressionValue job={job} value={value.expr.right} />;

    left = (
      <span>
        {l} {operator} {r}
      </span>
    );
  }

  if ('env' in value) {
    return <span>current {value.env}</span>;
  }

  if ('ref' in value) {
    left = <VariableValue job={job} variableRef={value.ref} />;
  }

  return left;
};
