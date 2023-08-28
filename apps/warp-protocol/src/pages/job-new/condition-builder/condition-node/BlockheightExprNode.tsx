import { UIElementProps } from '@terra-money/apps/components';
import { forwardRef, useEffect, useState } from 'react';
import { warp_resolver } from '@terra-money/warp-sdk';
import { isEqual } from 'lodash';

import styles from './ConditionNode.module.sass';
import { OperatorInput } from './operator-input/OperatorInput';
import { NumericInput } from 'components/primitives/numeric-input';

type BlockheightExprNodeProps = UIElementProps & {
  expr: warp_resolver.BlockExpr;
  setExpr: (expr: warp_resolver.BlockExpr) => void;
};

const numOperators: warp_resolver.NumOp[] = ['eq', 'neq', 'gt', 'gte', 'lte', 'lt'];

export const BlockheightExprNode = forwardRef((props: BlockheightExprNodeProps, ref: React.Ref<HTMLDivElement>) => {
  const { expr, setExpr } = props;

  const [op, setOp] = useState<warp_resolver.NumOp>(expr.op);
  const [comparator, setComparator] = useState<string>(expr.comparator);

  useEffect(() => {
    if (!isEqual({ op, comparator }, expr)) {
      setExpr({ op, comparator });
    }
  }, [op, comparator, setExpr, expr]);

  const Op = (
    <OperatorInput<warp_resolver.NumOp>
      operators={numOperators}
      value={op}
      onChange={setOp}
      menuClass={styles.blockheight_expr_menu}
      className={styles.blockheight_expr_op}
    />
  );

  const Right = (
    <NumericInput
      className={styles.blockheight_input}
      placeholder="Type here"
      margin="none"
      value={comparator}
      onChange={(event) => {
        setComparator(event.target.value);
      }}
    />
  );

  return (
    <>
      {Op}
      {Right}
    </>
  );
});
