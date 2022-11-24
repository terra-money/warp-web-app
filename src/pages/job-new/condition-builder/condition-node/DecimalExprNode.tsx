import { UIElementProps } from 'shared/components';
import { forwardRef, useEffect, useState } from 'react';
import { warp_controller } from 'types';
import { isEqual } from 'lodash';

import styles from './ConditionNode.module.sass';
import { OperatorInput } from './operator-input/OperatorInput';
import { ValueInput } from './value-input/ValueInput';

type Expr = warp_controller.GenExprFor_NumValueFor_Decimal256And_NumExprOpAnd_DecimalFnOpAnd_NumOp;
type Value = warp_controller.NumValueFor_Decimal256And_NumExprOpAnd_DecimalFnOp;

type DecimalExprNodeProps = UIElementProps & {
  expr: Expr;
  setExpr: (expr: Expr) => void;
};

const numOperators: warp_controller.NumOp[] = ['eq', 'neq', 'gt', 'gte', 'lte', 'lt'];

export const DecimalExprNode = forwardRef((props: DecimalExprNodeProps, ref: React.Ref<HTMLDivElement>) => {
  const { expr, setExpr } = props;

  const [op, setOp] = useState<warp_controller.NumOp>(expr.op);
  const [left, setLeft] = useState<Value>(expr.left);
  const [right, setRight] = useState<Value>(expr.right);

  useEffect(() => {
    if (!isEqual({ left, right, op }, expr)) {
      setExpr({ left, right, op });
    }
  }, [op, left, right, setExpr, expr]);

  const Left = <ValueInput variant="number" value={left} onChange={(v) => setLeft(v)} />;

  const Op = (
    <OperatorInput<warp_controller.NumOp>
      operators={numOperators}
      value={op}
      onChange={setOp}
      menuClass={styles.decimal_expr_menu}
      className={styles.decimal_expr_op}
    />
  );

  const Right = <ValueInput variant="number" value={right} onChange={(v) => setRight(v)} />;

  return (
    <>
      {Left}
      {Op}
      {Right}
    </>
  );
});
