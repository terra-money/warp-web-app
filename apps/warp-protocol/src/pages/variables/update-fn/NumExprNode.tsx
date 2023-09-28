import { UIElementProps } from '@terra-money/apps/components';
import React, { forwardRef, useEffect, useState } from 'react';
import { warp_resolver } from '@terra-money/warp-sdk';
import { isEqual } from 'lodash';

import styles from './UpdateFnNode.module.sass';
import { ValueInput } from 'pages/job-new/condition-builder/condition-node/value-input/ValueInput';
import { OperatorInput } from 'pages/job-new/condition-builder/condition-node/operator-input/OperatorInput';

type Expr =
  | warp_resolver.NumExprValueForInt128And_NumExprOpAnd_IntFnOp
  | warp_resolver.NumExprValueFor_Uint256And_NumExprOpAnd_IntFnOp
  | warp_resolver.NumExprValueFor_Decimal256And_NumExprOpAnd_DecimalFnOp;

type Value =
  | warp_resolver.NumValueForInt128And_NumExprOpAnd_IntFnOp
  | warp_resolver.NumValueFor_Uint256And_NumExprOpAnd_IntFnOp
  | warp_resolver.NumValueFor_Decimal256And_NumExprOpAnd_DecimalFnOp;

type NumExprNodeProps = UIElementProps & {
  expr: Expr;
  kind: warp_resolver.VariableKind;
  setExpr: (expr: Expr) => void;
  variant: 'number' | 'text';
};

const numOperators: warp_resolver.NumExprOp[] = ['add', 'sub', 'div', 'mul', 'mod'];

export const NumExprNode = forwardRef((props: NumExprNodeProps, ref: React.Ref<HTMLDivElement>) => {
  const { expr, setExpr, variant, kind } = props;

  const [op, setOp] = useState<warp_resolver.NumExprOp>(expr.op);
  const [left, setLeft] = useState<Value>(expr.left);
  const [right, setRight] = useState<Value>(expr.right);

  useEffect(() => {
    if (!isEqual({ left, right, op }, expr)) {
      setExpr({ left, right, op } as any);
    }
  }, [op, left, right, setExpr, expr]);

  const Left = <ValueInput<any> kind={kind} variant={variant} value={left} onChange={(v) => setLeft(v)} />;

  const Op = (
    <OperatorInput<warp_resolver.NumExprOp>
      operators={numOperators}
      value={op}
      onChange={setOp}
      menuClass={styles.int_expr_menu}
      className={styles.int_expr_op}
    />
  );

  const Right = <ValueInput<any> kind={kind} variant={variant} value={right} onChange={(v) => setRight(v)} />;

  return (
    <>
      {Left}
      {Op}
      {Right}
    </>
  );
});
