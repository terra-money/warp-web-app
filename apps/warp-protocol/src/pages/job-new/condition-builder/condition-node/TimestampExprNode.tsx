import { UIElementProps } from '@terra-money/apps/components';
import { forwardRef, useEffect, useState } from 'react';
import { warp_controller } from 'types';
import { isEqual, isEmpty } from 'lodash';

import styles from './ConditionNode.module.sass';
import { OperatorInput } from './operator-input/OperatorInput';
import { DateInput } from './date-input/DateInput';

type TimestampExprNodeProps = UIElementProps & {
  expr: warp_controller.TimeExpr;
  setExpr: (expr: warp_controller.TimeExpr) => void;
};

const timeOperators: warp_controller.TimeOp[] = ['gt', 'lt'];

const toTimestamp = (date?: Date) => String(Math.floor((date?.getTime() ?? 0) / 1000));
const toDate = (timestamp: string) => (isEmpty(timestamp) ? undefined : new Date(Number(timestamp) * 1000));

export const TimestampExprNode = forwardRef((props: TimestampExprNodeProps, ref: React.Ref<HTMLDivElement>) => {
  const { expr, setExpr } = props;

  const [op, setOp] = useState<warp_controller.TimeOp>(expr.op);
  const [comparator, setComparator] = useState<Date | undefined>(toDate(expr.comparator));

  useEffect(() => {
    if (!isEqual({ op, comparator: toTimestamp(comparator) }, expr)) {
      setExpr({ op, comparator: toTimestamp(comparator) });
    }
  }, [op, comparator, setExpr, expr]);

  const Op = (
    <OperatorInput<warp_controller.TimeOp>
      operators={timeOperators}
      value={op}
      onChange={setOp}
      menuClass={styles.timestamp_expr_menu}
      className={styles.timestamp_expr_op}
    />
  );

  const Right = (
    <DateInput
      className={styles.timestamp_input}
      placeholder={`Example: "tomorrow at 15:30"`}
      value={comparator}
      onChange={(v) => setComparator(v)}
    />
  );

  return (
    <>
      {Op}
      {Right}
    </>
  );
});
