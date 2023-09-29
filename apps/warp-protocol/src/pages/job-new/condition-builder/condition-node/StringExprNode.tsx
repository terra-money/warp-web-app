import { UIElementProps } from '@terra-money/apps/components';
import { forwardRef, useEffect, useState } from 'react';
import { warp_resolver } from '@terra-money/warp-sdk';
import { isEqual } from 'lodash';

import styles from './ConditionNode.module.sass';
import { OperatorInput } from './operator-input/OperatorInput';
import { ValueInput } from './value-input/ValueInput';

type Expr = warp_resolver.GenExprFor_ValueFor_StringAnd_StringOp;
type Value = warp_resolver.ValueFor_String;

type StringExprNodeProps = UIElementProps & {
  expr: Expr;
  setExpr: (expr: Expr) => void;
};

const numOperators: warp_resolver.StringOp[] = ['eq', 'neq', 'contains', 'starts_with', 'ends_with'];

export const StringExprNode = forwardRef((props: StringExprNodeProps, ref: React.Ref<HTMLDivElement>) => {
  const { expr, setExpr } = props;

  const [op, setOp] = useState<warp_resolver.StringOp>(expr.op);
  const [left, setLeft] = useState<Value>(expr.left);
  const [right, setRight] = useState<Value>(expr.right);

  useEffect(() => {
    if (!isEqual({ left, right, op }, expr)) {
      setExpr({ left, right, op });
    }
  }, [op, left, right, setExpr, expr]);

  const Left = <ValueInput kind="string" value={left} onChange={(v) => setLeft(v)} />;

  const Op = (
    <OperatorInput<warp_resolver.StringOp>
      operators={numOperators}
      value={op}
      onChange={setOp}
      menuClass={styles.int_expr_menu}
      className={styles.int_expr_op}
    />
  );

  const Right = <ValueInput kind="string" value={right} onChange={(v) => setRight(v)} />;

  return (
    <>
      {Left}
      {Op}
      {Right}
    </>
  );
});
