import { UIElementProps } from '@terra-money/apps/components';
import { ReactComponent as TrashIcon } from 'components/assets/Trash.svg';
import { Button, Text } from 'components/primitives';
import { forwardRef } from 'react';
import { warp_controller } from 'types';
import { BlockheightExprNode } from './BlockheightExprNode';
// import { BoolExprNode } from './BoolExprNode';

import styles from './ConditionNode.module.sass';
import { DecimalExprNode } from './DecimalExprNode';
import { IntExprNode } from './IntExprNode';
import { StringExprNode } from './StringExprNode';
import { TimestampExprNode } from './TimestampExprNode';

type ExprNodeProps = UIElementProps & {
  expr: warp_controller.Expr;
  setCond: (cond: warp_controller.Condition) => void;
};

export const ExprNode = forwardRef((props: ExprNodeProps, ref: React.Ref<HTMLDivElement>) => {
  const { expr, setCond } = props;

  if ('string' in expr) {
    return (
      <div ref={ref} className={styles.expr_node}>
        <Text className={styles.label} variant="label">
          String expression
        </Text>
        <div className={styles.exprs}>
          <StringExprNode expr={expr.string} setExpr={(expr) => setCond({ expr: { string: expr } })} />
          <Button
            className={styles.delete_btn}
            icon={<TrashIcon onClick={() => setCond({} as any)} />}
            iconGap="none"
          />
        </div>
      </div>
    );
  }

  if ('uint' in expr) {
    return (
      <div ref={ref} className={styles.expr_node}>
        <Text className={styles.label} variant="label">
          Integer expression
        </Text>
        <div className={styles.exprs}>
          <IntExprNode expr={expr.uint} setExpr={(expr) => setCond({ expr: { uint: expr } })} />
          <Button
            className={styles.delete_btn}
            icon={<TrashIcon onClick={() => setCond({} as any)} />}
            iconGap="none"
          />
        </div>
      </div>
    );
  }

  if ('decimal' in expr) {
    return (
      <div ref={ref} className={styles.expr_node}>
        <Text className={styles.label} variant="label">
          Decimal expression
        </Text>
        <div className={styles.exprs}>
          <DecimalExprNode expr={expr.decimal} setExpr={(expr) => setCond({ expr: { decimal: expr } })} />
          <Button
            className={styles.delete_btn}
            icon={<TrashIcon onClick={() => setCond({} as any)} />}
            iconGap="none"
          />
        </div>
      </div>
    );
  }

  if ('timestamp' in expr) {
    return (
      <div ref={ref} className={styles.expr_node}>
        <Text className={styles.label} variant="label">
          Timestamp expression
        </Text>
        <div className={styles.exprs}>
          <TimestampExprNode expr={expr.timestamp} setExpr={(expr) => setCond({ expr: { timestamp: expr } })} />
          <Button
            className={styles.delete_btn}
            icon={<TrashIcon onClick={() => setCond({} as any)} />}
            iconGap="none"
          />
        </div>
      </div>
    );
  }

  if ('block_height' in expr) {
    return (
      <div ref={ref} className={styles.expr_node}>
        <Text className={styles.label} variant="label">
          Blockheight expression
        </Text>
        <div className={styles.exprs}>
          <BlockheightExprNode expr={expr.block_height} setExpr={(expr) => setCond({ expr: { block_height: expr } })} />
          <Button
            className={styles.delete_btn}
            icon={<TrashIcon onClick={() => setCond({} as any)} />}
            iconGap="none"
          />
        </div>
      </div>
    );
  }

  if ('bool' in expr) {
    return (
      <div ref={ref} className={styles.expr_node}>
        <Text className={styles.label} variant="label">
          Boolean expression
        </Text>
        <div className={styles.exprs}>
          {/* <BoolExprNode expr={expr.bool} setExpr={(expr) => setCond({ expr: { bool: expr } })} /> */}
          <Button
            className={styles.delete_btn}
            icon={<TrashIcon onClick={() => setCond({} as any)} />}
            iconGap="none"
          />
        </div>
      </div>
    );
  }

  return null;
});
