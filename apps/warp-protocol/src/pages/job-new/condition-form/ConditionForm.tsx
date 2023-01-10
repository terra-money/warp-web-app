import { Container, UIElementProps } from '@terra-money/apps/components';
import styles from './ConditionForm.module.sass';
import { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { warp_controller } from 'types';
import { Form } from 'components/form/Form';
import { ConditionBuilder } from '../condition-builder/ConditionBuilder';
import { Footer } from '../footer/Footer';
import { Button, Link, Text } from 'components/primitives';
import classNames from 'classnames';
import { useNavigate } from 'react-router';
import { useJobStorage } from '../useJobStorage';

type ConditionFormProps = UIElementProps & {
  loading: boolean;
  onNext: (props: { cond: warp_controller.Condition }) => Promise<void>;
};

export const ConditionForm = (props: ConditionFormProps) => {
  const { onNext, loading, className } = props;

  const { cond, setCond } = useJobStorage();
  const [valid, setValid] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const filtered = filterEmptyCond(cond ?? ({} as warp_controller.Condition));
    setValid(Boolean(filtered));
  }, [cond]);

  return (
    <Form className={classNames(styles.root, className)}>
      <Container className={styles.title_container}>
        <Text variant="heading1" className={styles.title}>
          Create condition
        </Text>
        <Link className={styles.back} to={-1}>
          Back
        </Link>
        <Text className={styles.description} variant="label">
          Using the condition builder below you may construct a boolean expression using types such as String, Integer,
          Decimal, Boolean, Timestamp or Blockheight along with accompaying operators, under which the job will be
          executed.
        </Text>
      </Container>
      <ConditionBuilder cond={cond} setCond={setCond} />
      <Footer>
        <Button
          variant="primary"
          disabled={!valid}
          loading={loading}
          onClick={async () => {
            if (valid && cond) {
              return onNext({ cond: filterEmptyCond(cond)! });
            }
          }}
        >
          Save
        </Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Footer>
    </Form>
  );
};

export const filterEmptyCond = (input: warp_controller.Condition) => {
  let cond = { ...input };

  if ('and' in cond) {
    cond.and = cond.and.map(filterEmptyCond).filter(Boolean) as warp_controller.Condition[];

    if (cond.and.length === 0) {
      return undefined;
    }
  }

  if ('or' in cond) {
    cond.or = cond.or.map(filterEmptyCond).filter(Boolean) as warp_controller.Condition[];

    if (cond.or.length === 0) {
      return undefined;
    }
  }

  if ('not' in cond) {
    const not = filterEmptyCond(cond.not);

    if (!not) {
      return undefined;
    }

    cond.not = not;
  }

  if ('expr' in cond) {
    if (isEmpty(cond.expr)) {
      return undefined;
    }

    const expr = filterExpr(cond.expr);

    if (!expr) {
      return undefined;
    }

    cond.expr = expr;
  }

  return isEmpty(cond) ? undefined : cond;
};

const filterExpr = (expr: warp_controller.Expr) => {
  if ('string' in expr) {
    if (
      (validSimple(expr.string.left) || validRef(expr.string.left)) &&
      (validSimple(expr.string.right) || validRef(expr.string.right))
    ) {
      return expr;
    }
  }

  if ('uint' in expr) {
    if (
      (validSimple(expr.uint.left) || validRef(expr.uint.left)) &&
      (validSimple(expr.uint.right) || validRef(expr.uint.right))
    ) {
      return expr;
    }
  }

  if ('decimal' in expr) {
    if (
      (validSimple(expr.decimal.left) || validRef(expr.decimal.left)) &&
      (validSimple(expr.decimal.right) || validRef(expr.decimal.right))
    ) {
      return expr;
    }
  }

  if ('timestamp' in expr) {
    if (validTime(expr.timestamp)) {
      return expr;
    }
  }

  if ('block_height' in expr) {
    if (validTime(expr.block_height)) {
      return expr;
    }
  }

  if ('bool' in expr) {
    if (!isEmpty(expr.bool)) {
      return expr;
    }
  }

  // TODO: add support for other
  return undefined;
};

const validSimple = (
  value:
    | warp_controller.NumValueFor_Uint256And_NumExprOpAnd_IntFnOp
    | warp_controller.NumValueFor_Decimal256And_NumExprOpAnd_DecimalFnOp
    | warp_controller.ValueFor_String
) => {
  if ('simple' in value) {
    return !isEmpty(value.simple);
  }

  return false;
};

const validTime = (value: warp_controller.TimeExpr | warp_controller.BlockExpr) => {
  if (!isEmpty(value.comparator) && Number(value.comparator) > 0) {
    return true;
  }

  return false;
};

const validRef = (
  value:
    | warp_controller.NumValueFor_Uint256And_NumExprOpAnd_IntFnOp
    | warp_controller.NumValueFor_Decimal256And_NumExprOpAnd_DecimalFnOp
    | warp_controller.ValueFor_String
) => {
  if ('ref' in value) {
    return !isEmpty(value.ref);
  }

  return false;
};
