import { warp_controller } from 'types';
import { isObject } from 'lodash';
import { decodeQuery } from 'forms/variables';
import { variableName } from './variable';
import { decodeMsg } from 'pages/job-new/useJobStorage';

export function filterUnreferencedVariablesInCosmosMsg(
  vars: warp_controller.Variable[],
  msgs: warp_controller.CosmosMsgFor_Empty[],
  condition?: warp_controller.Condition
): warp_controller.Variable[] {
  const referencedVars = extractReferencedVarNamesInCosmosMsg(vars, msgs, condition);

  return referencedVars
    .map((name) => vars.find((v) => variableName(v) === name))
    .filter(Boolean) as warp_controller.Variable[];
}

export function containsAllReferencedVarsInCosmosMsg(
  vars: warp_controller.Variable[],
  msgs: warp_controller.CosmosMsgFor_Empty[],
  condition?: warp_controller.Condition
): boolean {
  const referencedVars = extractReferencedVarNamesInCosmosMsg(vars, msgs, condition);

  return !Boolean(referencedVars.some((name) => !vars.some((v) => variableName(v) === name)));
}

type NumExpr =
  | warp_controller.NumValueForInt128And_NumExprOpAnd_IntFnOp
  | warp_controller.NumValueFor_Decimal256And_NumExprOpAnd_DecimalFnOp
  | warp_controller.NumValueFor_Uint256And_NumExprOpAnd_IntFnOp;

export function extractReferencedVarNamesInCosmosMsg(
  vars: warp_controller.Variable[],
  msgs: warp_controller.CosmosMsgFor_Empty[],
  condition?: warp_controller.Condition
): string[] {
  const referencedVars: Set<string> = new Set();
  const unreferencedVars: Set<string> = new Set(vars.map((v) => variableName(v)));

  msgs.forEach((msg) => scanForReferencesForCosmosMsg(msg).forEach((varName) => referencedVars.add(varName)));

  vars.forEach((v) => {
    if ('query' in v) {
      const q = decodeQuery(v.query.init_fn.query);
      scanForReferences(q).forEach((varName) => referencedVars.add(varName));
    }
  });

  // Add all variables that are referenced in the `condition` param to the `referencedVars` set
  function addReferencedVarsFromCondition(cond: warp_controller.Condition, referencedVars: Set<string>): void {
    if ('and' in cond) {
      cond.and.forEach((c) => addReferencedVarsFromCondition(c, referencedVars));
    } else if ('or' in cond) {
      cond.or.forEach((c) => addReferencedVarsFromCondition(c, referencedVars));
    } else if ('not' in cond) {
      addReferencedVarsFromCondition(cond.not, referencedVars);
    } else if ('expr' in cond) {
      if (['uint', 'int', 'decimal'].some((t) => t in cond.expr)) {
        const addReferencedVarsFromNumExpr = (expr: NumExpr): void => {
          if (!isObject(expr)) {
            return;
          }

          if ('ref' in expr) {
            referencedVars.add(extractName(expr.ref));
          } else if ('expr' in expr) {
            addReferencedVarsFromNumExpr(expr.expr.left);
            addReferencedVarsFromNumExpr(expr.expr.right);
          } else if ('fn' in expr) {
            addReferencedVarsFromNumExpr(expr.fn.right);
          }
        };

        const numexpr = Object.values(cond.expr)[0] as warp_controller.NumExprValueFor_Uint256And_NumExprOpAnd_IntFnOp;
        Object.values(numexpr).forEach(addReferencedVarsFromNumExpr);
      }

      if ('string' in cond.expr) {
        if ('ref' in cond.expr.string.left) {
          referencedVars.add(extractName(cond.expr.string.left.ref));
        }

        if ('ref' in cond.expr.string.right) {
          referencedVars.add(extractName(cond.expr.string.right.ref));
        }
      }

      if ('bool' in cond.expr) {
        referencedVars.add(extractName(cond.expr.bool));
      }
    }
  }

  if (condition) {
    addReferencedVarsFromCondition(condition, referencedVars);
  }

  // Remove all referenced variables from the `unreferencedVars` set
  referencedVars.forEach((referencedVar) => unreferencedVars.delete(referencedVar));

  return Array.from(referencedVars);
}

export const scanForReferences = (obj: any): string[] => {
  let res: string[] = [];

  if (obj && typeof obj === 'object') {
    Object.entries(obj).forEach(([k, v]) => {
      if (typeof v === 'string' && v.startsWith('$warp.variable.')) {
        const varName = v.substring('$warp.variable.'.length);
        res = [...res, varName];
      } else {
        res = [...res, ...scanForReferences(v)];
      }
    });
  }

  return res;
};

const scanForReferencesForCosmosMsg = (msg: warp_controller.CosmosMsgFor_Empty): string[] => {
  const obj = decodeMsg(msg);
  return scanForReferences(obj);
};

const extractName = (str: string) => {
  const parts = str.split('.');
  return parts[parts.length - 1];
};
