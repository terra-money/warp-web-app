import { UIElementProps } from '@terra-money/apps/components';
import { forwardRef } from 'react';
import { VariableInput } from './variable-input/VariableInput';

type BoolExprNodeProps = UIElementProps & {
  expr: string;
  setExpr: (expr: string) => void;
};

export const BoolExprNode = forwardRef((props: BoolExprNodeProps, ref: React.Ref<HTMLDivElement>) => {
  const { expr, setExpr } = props;

  return <VariableInput value={expr} onChange={setExpr} />;
});
