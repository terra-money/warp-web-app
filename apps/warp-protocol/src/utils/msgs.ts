import { isObject } from 'lodash';
import { decodeQuery } from 'forms/variables';
import { variableName } from './variable';
import { decodeMsg } from 'pages/job-new/useJobStorage';
import { warp_resolver, extractVariableName } from '@terra-money/warp-sdk';

export function filterUnreferencedVariablesInCosmosMsg(
  vars: warp_resolver.Variable[],
  msgs: warp_resolver.CosmosMsgFor_Empty[],
  condition?: warp_resolver.Condition
): warp_resolver.Variable[] {
  const referencedVars = extractReferencedVarNamesInCosmosMsg(vars, msgs, condition);

  return referencedVars
    .map((name) => vars.find((v) => variableName(v) === name))
    .filter(Boolean) as warp_resolver.Variable[];
}

export function containsAllReferencedVarsInCosmosMsg(
  vars: warp_resolver.Variable[],
  msgs: warp_resolver.CosmosMsgFor_Empty[],
  condition?: warp_resolver.Condition
): boolean {
  const referencedVars = extractReferencedVarNamesInCosmosMsg(vars, msgs, condition);

  return !Boolean(referencedVars.some((name) => !vars.some((v) => variableName(v) === name)));
}

type NumExpr =
  | warp_resolver.NumValueForInt128And_NumExprOpAnd_IntFnOp
  | warp_resolver.NumValueFor_Decimal256And_NumExprOpAnd_DecimalFnOp
  | warp_resolver.NumValueFor_Uint256And_NumExprOpAnd_IntFnOp;

export function extractReferencedVarNamesInCosmosMsg(
  vars: warp_resolver.Variable[],
  msgs: warp_resolver.CosmosMsgFor_Empty[],
  condition?: warp_resolver.Condition
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
  function addReferencedVarsFromCondition(cond: warp_resolver.Condition, referencedVars: Set<string>): void {
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
            referencedVars.add(extractVariableName(expr.ref));
          } else if ('expr' in expr) {
            addReferencedVarsFromNumExpr(expr.expr.left);
            addReferencedVarsFromNumExpr(expr.expr.right);
          } else if ('fn' in expr) {
            addReferencedVarsFromNumExpr(expr.fn.right);
          }
        };

        const numexpr = Object.values(cond.expr)[0] as warp_resolver.NumExprValueFor_Uint256And_NumExprOpAnd_IntFnOp;
        Object.values(numexpr).forEach(addReferencedVarsFromNumExpr);
      }

      if ('string' in cond.expr) {
        if ('ref' in cond.expr.string.left) {
          referencedVars.add(extractVariableName(cond.expr.string.left.ref));
        }

        if ('ref' in cond.expr.string.right) {
          referencedVars.add(extractVariableName(cond.expr.string.right.ref));
        }
      }

      if ('bool' in cond.expr) {
        referencedVars.add(extractVariableName(cond.expr.bool));
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

const scanForReferencesForCosmosMsg = (msg: warp_resolver.CosmosMsgFor_Empty): string[] => {
  const obj = decodeMsg(msg);
  return scanForReferences(obj);
};
