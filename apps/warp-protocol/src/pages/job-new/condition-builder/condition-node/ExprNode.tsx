import { UIElementProps } from '@terra-money/apps/components';
import { ReactComponent as TrashIcon } from 'components/assets/Trash.svg';
import { Button, Text } from 'components/primitives';
import { forwardRef } from 'react';
import { warp_resolver } from '@terra-money/warp-sdk';
import { BoolExprNode } from './BoolExprNode';
import styles from './ConditionNode.module.sass';
import { DecimalExprNode } from './DecimalExprNode';
import { UIntExprNode } from './UIntExprNode';
import { StringExprNode } from './StringExprNode';
import { IntExprNode } from './IntExprNode';

type ExprNodeProps = UIElementProps & {
  expr: warp_resolver.Expr;
  setCond: (cond: warp_resolver.Condition) => void;
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
          Uint expression
        </Text>
        <div className={styles.exprs}>
          <UIntExprNode expr={expr.uint} setExpr={(expr) => setCond({ expr: { uint: expr } })} />
          <Button
            className={styles.delete_btn}
            icon={<TrashIcon onClick={() => setCond({} as any)} />}
            iconGap="none"
          />
        </div>
      </div>
    );
  }

  if ('int' in expr) {
    return (
      <div ref={ref} className={styles.expr_node}>
        <Text className={styles.label} variant="label">
          Int expression
        </Text>
        <div className={styles.exprs}>
          <IntExprNode expr={expr.int} setExpr={(expr) => setCond({ expr: { int: expr } })} />
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

  if ('bool' in expr) {
    return (
      <div ref={ref} className={styles.expr_node}>
        <Text className={styles.label} variant="label">
          Boolean expression
        </Text>
        <div className={styles.exprs}>
          <BoolExprNode expr={expr.bool} setExpr={(expr) => setCond({ expr: { bool: expr } })} />
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
