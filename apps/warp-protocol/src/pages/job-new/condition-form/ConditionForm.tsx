import { Container, UIElementProps } from '@terra-money/apps/components';
import styles from './ConditionForm.module.sass';
import { useEffect, useState } from 'react';
import { isEmpty, isNumber } from 'lodash';
import { warp_resolver } from '@terra-money/warp-sdk';
import { Form } from 'components/form/Form';
import { ConditionBuilder } from '../condition-builder/ConditionBuilder';
import { Footer } from '../footer/Footer';
import { Button, Link, Text } from 'components/primitives';
import classNames from 'classnames';
import { useNavigate } from 'react-router';
import { useJobStorage } from '../useJobStorage';
import { useCachedVariables } from '../useCachedVariables';

type ConditionFormProps = UIElementProps & {
  loading: boolean;
  onNext: (props: { cond: warp_resolver.Condition; variables: warp_resolver.Variable[] }) => Promise<void>;
};

export const ConditionForm = (props: ConditionFormProps) => {
  const { onNext, loading, className } = props;

  const { cond, setCond } = useJobStorage();
  const [valid, setValid] = useState<boolean>(false);

  const navigate = useNavigate();

  const { variables } = useCachedVariables();

  useEffect(() => {
    const filtered = filterEmptyCond(cond ?? ({} as warp_resolver.Condition));
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
              return onNext({ cond: filterEmptyCond(cond)!, variables });
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

export const filterEmptyCond = (input: warp_resolver.Condition) => {
  let cond = { ...input };

  if ('and' in cond) {
    cond.and = cond.and.map(filterEmptyCond).filter(Boolean) as warp_resolver.Condition[];

    if (cond.and.length === 0) {
      return undefined;
    }
  }

  if ('or' in cond) {
    cond.or = cond.or.map(filterEmptyCond).filter(Boolean) as warp_resolver.Condition[];

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

const filterExpr = (expr: warp_resolver.Expr) => {
  if ('string' in expr) {
    if (validValue(expr.string.left) && validValue(expr.string.right)) {
      return expr;
    }
  }

  if ('uint' in expr) {
    if (validValue(expr.uint.left) && validValue(expr.uint.right)) {
      return expr;
    }
  }

  if ('int' in expr) {
    if (validValue(expr.int.left) && validValue(expr.int.right)) {
      return expr;
    }
  }

  if ('decimal' in expr) {
    if (validValue(expr.decimal.left) && validValue(expr.decimal.right)) {
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

const validValue = (
  value:
    | warp_resolver.NumValueFor_Uint256And_NumExprOpAnd_IntFnOp
    | warp_resolver.NumValueFor_Decimal256And_NumExprOpAnd_DecimalFnOp
    | warp_resolver.ValueFor_String
    | warp_resolver.NumValueForInt128And_NumExprOpAnd_IntFnOp
) => {
  if (validSimple(value) || validRef(value) || validEnv(value)) {
    return true;
  }

  return false;
};

const validSimple = (
  value:
    | warp_resolver.NumValueFor_Uint256And_NumExprOpAnd_IntFnOp
    | warp_resolver.NumValueFor_Decimal256And_NumExprOpAnd_DecimalFnOp
    | warp_resolver.ValueFor_String
    | warp_resolver.NumValueForInt128And_NumExprOpAnd_IntFnOp
) => {
  if ('simple' in value) {
    return !isEmpty(value.simple) || isNumber(value.simple);
  }

  return false;
};

const validRef = (
  value:
    | warp_resolver.NumValueFor_Uint256And_NumExprOpAnd_IntFnOp
    | warp_resolver.NumValueFor_Decimal256And_NumExprOpAnd_DecimalFnOp
    | warp_resolver.ValueFor_String
    | warp_resolver.NumValueForInt128And_NumExprOpAnd_IntFnOp
) => {
  if ('ref' in value) {
    return !isEmpty(value.ref);
  }

  return false;
};

const validEnv = (
  value:
    | warp_resolver.NumValueFor_Uint256And_NumExprOpAnd_IntFnOp
    | warp_resolver.NumValueFor_Decimal256And_NumExprOpAnd_DecimalFnOp
    | warp_resolver.ValueFor_String
    | warp_resolver.NumValueForInt128And_NumExprOpAnd_IntFnOp
) => {
  if ('env' in value) {
    return !isEmpty(value.env);
  }

  return false;
};
