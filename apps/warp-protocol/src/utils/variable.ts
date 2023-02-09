import { Variable } from 'pages/variables/useVariableStorage';
import { warp_controller } from 'types';
import { isObject } from 'lodash';
import { decodeQuery } from 'forms/variables';
import { encodeQuery } from './encodeQuery';

export const resolveVariableRef = (ref: string, vars: warp_controller.Variable[]) => {
  const name = extractName(ref);
  const v = vars.find((v) => variableName(v) === name);
  return v as warp_controller.Variable;
};

export const isVariableRef = (value: string) => value.startsWith('$warp.variable.');

export const variableRef = (variable: warp_controller.Variable) => {
  return `$warp.variable.${variableName(variable)}`;
};

export const variableName = (v: warp_controller.Variable): string => {
  if (!v) {
    return 'unknown';
  }

  if ('static' in v) {
    return v.static.name;
  }

  if ('external' in v) {
    return v.external.name;
  }

  return v.query.name;
};

export const variableValue = (v: warp_controller.Variable) => {
  if ('static' in v) {
    return v.static.value;
  }

  if ('external' in v) {
    return v.external.value;
  }

  return v.query.value;
};

export const variableKind = (v: warp_controller.Variable): warp_controller.VariableKind => {
  if ('static' in v) {
    return v.static.kind;
  }

  if ('external' in v) {
    return v.external.kind;
  }

  return v.query.kind;
};

const extractName = (str: string) => {
  const parts = str.split('.');
  return parts[parts.length - 1];
};

export const templateVariables = (template: warp_controller.Template) => {
  const staticVariables = template.vars.filter((v) => 'static' in v) as Extract<
    warp_controller.Variable,
    { static: {} }
  >[];

  return staticVariables.map((v) => v.static);
};

export const findVariablePath = (json: any, name: string): string | undefined => {
  const path: string[] = [];

  const search = (obj: any, currentPath: string): boolean => {
    if (obj instanceof Object) {
      for (const [key, value] of Object.entries(obj)) {
        if (search(value, `${currentPath}.${key}`)) {
          return true;
        }
      }
      return false;
    }
    if (obj === `$warp.variable.${name}`) {
      path.push(currentPath);
      return true;
    }
    return false;
  };

  search(json, '$');

  return path.length > 0 ? path[0] : undefined;
};

type NumExpr =
  | warp_controller.NumValueForInt128And_NumExprOpAnd_IntFnOp
  | warp_controller.NumValueFor_Decimal256And_NumExprOpAnd_DecimalFnOp
  | warp_controller.NumValueFor_Uint256And_NumExprOpAnd_IntFnOp;

// Recursively scan the `msgs` array for variable references
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

export function containsAllReferencedVars(
  vars: warp_controller.Variable[],
  msgsInput: string,
  condition?: warp_controller.Condition
): boolean {
  const referencedVars = extractReferencedVarNames(vars, msgsInput, condition);

  return !Boolean(referencedVars.some((name) => !vars.some((v) => variableName(v) === name)));
}

export function extractReferencedVarNames(
  vars: warp_controller.Variable[],
  msgsInput: string,
  condition?: warp_controller.Condition
): string[] {
  const referencedVars: Set<string> = new Set();
  const unreferencedVars: Set<string> = new Set(vars.map((v) => variableName(v)));

  const parsed = JSON.parse(msgsInput);
  const msgs: object[] = Array.isArray(parsed) ? parsed : [parsed];

  msgs.forEach((msg) => scanForReferences(msg).forEach((varName) => referencedVars.add(varName)));

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

export function filterUnreferencedVariables(
  vars: warp_controller.Variable[],
  msgsInput: string,
  condition?: warp_controller.Condition
): Variable[] {
  const referencedVars = extractReferencedVarNames(vars, msgsInput, condition);

  return referencedVars.map((name) => vars.find((v) => variableName(v) === name)).filter(Boolean) as Variable[];
}

export const formattedStringVarNames = (formattedString: string) => {
  return formattedString.match(/\{[^}]+\}/g)?.map((s) => s.slice(1, -1)) || [];
};

export const formattedStringVariables = (formattedString: string, variables: Variable[]) => {
  const variableNames = formattedStringVarNames(formattedString);

  return variableNames.map((name) => variables.find((v) => variableName(v) === name)) as Variable[];
};

export function hasOnlyStaticVariables(formattedString: string, variables: Variable[]): boolean {
  // Extract all the variable names from the formatted string
  const variableNames = formattedStringVarNames(formattedString);

  // Check if all the variable names are defined in the list of variables
  return variableNames.every((name) => variables.some((v) => 'static' in v && v.static.name === name));
}

export function hydrateQueryVariablesWithStatics(variables: Variable[]): Variable[] {
  const staticVariables = variables
    .filter((variable) => 'static' in variable)
    .map((variable) => 'static' in variable && variable.static) as warp_controller.StaticVariable[];

  return variables.map((variable) => {
    if ('query' in variable) {
      const newVariable = { ...variable };
      let queryStr = JSON.stringify(decodeQuery(newVariable.query.init_fn.query));

      staticVariables.forEach((staticVariable) => {
        const search = `"$warp.variable.${staticVariable.name}"`;
        const replace = `"${staticVariable.value}"`;
        queryStr = queryStr.replace(search, replace);
      });

      newVariable.query.init_fn.query = encodeQuery(queryStr);

      return newVariable;
    } else {
      return variable;
    }
  });
}
