import { UIElementProps } from '@terra-money/apps/components';
import { forwardRef } from 'react';
import { ReactComponent as TrashIcon } from 'components/assets/Trash.svg';
import { Button, Text } from 'components/primitives';
import styles from './UpdateFnNode.module.sass';
import { NumExprNode } from './NumExprNode';
import { warp_resolver } from '@terra-money/warp-sdk';
import { ValueInput } from 'pages/job-new/condition-builder/condition-node/value-input/ValueInput';

type ConcreteNodeProps = UIElementProps & {
  updateFn: warp_resolver.FnValue;
  setUpdateFn: (updateFn: warp_resolver.FnValue) => void;
};

type Expr =
  | warp_resolver.NumExprValueForInt128And_NumExprOpAnd_IntFnOp
  | warp_resolver.NumExprValueFor_Uint256And_NumExprOpAnd_IntFnOp
  | warp_resolver.NumExprValueFor_Decimal256And_NumExprOpAnd_DecimalFnOp;

type Value =
  | warp_resolver.NumValueForInt128And_NumExprOpAnd_IntFnOp
  | warp_resolver.NumValueFor_Uint256And_NumExprOpAnd_IntFnOp
  | warp_resolver.NumValueFor_Decimal256And_NumExprOpAnd_DecimalFnOp;

type Type = 'int' | 'decimal' | 'uint';

export const ConcreteNode = forwardRef((props: ConcreteNodeProps, ref: React.Ref<HTMLDivElement>) => {
  const { updateFn, setUpdateFn } = props;

  const renderNumExprNode = (expr: Expr, type: Type) => {
    return (
      <div className={styles.expr_node}>
        <Text className={styles.label} variant="label">
          {type} expression
        </Text>
        <div className={styles.exprs}>
          <NumExprNode kind={type} expr={expr} setExpr={(expr) => setUpdateFn({ [type]: { expr } } as any)} />
          <Button
            className={styles.delete_btn}
            icon={<TrashIcon onClick={() => setUpdateFn({} as any)} />}
            iconGap="none"
          />
        </div>
      </div>
    );
  };

  const renderValueInput = (value: Value, type: Type) => {
    return (
      <div className={styles.expr_node}>
        <Text className={styles.label} variant="label">
          {type} value
        </Text>
        <div className={styles.exprs}>
          <ValueInput kind={type} value={value} onChange={(newValue) => setUpdateFn({ [type]: newValue } as any)} />
          <Button
            className={styles.delete_btn}
            icon={<TrashIcon onClick={() => setUpdateFn({} as any)} />}
            iconGap="none"
          />
        </div>
      </div>
    );
  };

  return (
    <div ref={ref} className={styles.node}>
      {'uint' in updateFn
        ? 'expr' in updateFn.uint
          ? renderNumExprNode(updateFn.uint.expr, 'uint')
          : renderValueInput(updateFn.uint, 'uint')
        : null}
      {'int' in updateFn
        ? 'expr' in updateFn.int
          ? renderNumExprNode(updateFn.int.expr, 'int')
          : renderValueInput(updateFn.int, 'int')
        : null}
      {'decimal' in updateFn
        ? 'expr' in updateFn.decimal
          ? renderNumExprNode(updateFn.decimal.expr, 'decimal')
          : renderValueInput(updateFn.decimal, 'decimal')
        : null}
    </div>
  );
});
