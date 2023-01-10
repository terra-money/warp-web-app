import { Variable } from 'pages/variables/useVariableStorage';
import { warp_controller } from 'types';

export const resolveVariableRef = (ref: string, vars: warp_controller.Variable[]) => {
  const name = extractName(ref);
  const v = vars.find((v) => variableName(v) === name);
  return v as warp_controller.Variable;
};

export const variableRef = (variable: warp_controller.Variable) => {
  return `$warp.variable.${variableName(variable)}`;
};

export const variableName = (v: warp_controller.Variable): string => {
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

export function filterUnreferencedVariables(
  vars: warp_controller.Variable[],
  msgsInput: string,
  condition?: warp_controller.Condition
): Variable[] {
  const referencedVars: Set<string> = new Set();
  const unreferencedVars: Set<string> = new Set(vars.map((v) => variableName(v)));

  const parsed = JSON.parse(msgsInput);
  const msgs: object[] = Array.isArray(parsed) ? parsed : [parsed];

  msgs.forEach((msg) => scanForReferences(msg).forEach((varName) => referencedVars.add(varName)));

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
          if ('ref' in expr) {
            referencedVars.add(expr.ref);
          } else if ('expr' in expr) {
            addReferencedVarsFromNumExpr(expr.expr.left);
            addReferencedVarsFromNumExpr(expr.expr.right);
          } else if ('fn' in expr) {
            addReferencedVarsFromNumExpr(expr.fn.right);
          }
        };

        Object.values(cond.expr).forEach(addReferencedVarsFromNumExpr);
      }

      if ('string' in cond.expr) {
        if ('ref' in cond.expr.string.left) {
          referencedVars.add(cond.expr.string.left.ref);
        }

        if ('ref' in cond.expr.string.right) {
          referencedVars.add(cond.expr.string.right.ref);
        }
      }

      if ('bool' in cond.expr) {
        referencedVars.add(cond.expr.bool);
      }
    }
  }

  if (condition) {
    addReferencedVarsFromCondition(condition, referencedVars);
  }

  // Remove all referenced variables from the `unreferencedVars` set
  referencedVars.forEach((referencedVar) => unreferencedVars.delete(referencedVar));

  return Array.from(referencedVars)
    .map((name) => vars.find((v) => variableName(v) === name))
    .filter(Boolean) as Variable[];
}

export function hasOnlyStaticVariables(formattedString: string, variables: Variable[]): boolean {
  // Extract all the variable names from the formatted string
  const variableNames = formattedString.match(/\{[^}]+\}/g)?.map((s) => s.slice(1, -1)) || [];

  // Check if all the variable names are defined in the list of variables
  return variableNames.every((name) => variables.some((v) => 'static' in v && v.static.name === name));
}
