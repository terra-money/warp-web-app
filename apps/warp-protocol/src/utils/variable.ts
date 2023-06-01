import { Variable } from 'pages/variables/useVariableStorage';
import { warp_controller } from 'types';
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
  const prefix = '$warp.variable.';
  return str.substring(prefix.length);
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
