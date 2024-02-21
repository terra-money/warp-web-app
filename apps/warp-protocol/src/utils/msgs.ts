import { decodeQuery } from 'forms/variables';
import { variableName } from './variable';
import { decodeMsg } from 'pages/job-new/useJobStorage';
import { warp_resolver } from '@terra-money/warp-sdk';

export function filterUnreferencedVariables(
  vars: warp_resolver.Variable[],
  msgs: warp_resolver.WarpMsg[],
  condition?: warp_resolver.Condition
): warp_resolver.Variable[] {
  const referencedVars = extractReferencedVarNames(vars, msgs, condition);

  return referencedVars
    .map((name) => vars.find((v) => variableName(v) === name))
    .filter(Boolean) as warp_resolver.Variable[];
}

export function containsAllReferencedVars(
  vars: warp_resolver.Variable[],
  msgs: warp_resolver.WarpMsg[],
  condition?: warp_resolver.Condition
): boolean {
  const referencedVars = extractReferencedVarNames(vars, msgs, condition);

  return !Boolean(referencedVars.some((name) => !vars.some((v) => variableName(v) === name)));
}

export function extractReferencedVarNames(
  vars: warp_resolver.Variable[],
  msgs: warp_resolver.WarpMsg[],
  condition?: warp_resolver.Condition
): string[] {
  const referencedVars: Set<string> = new Set();
  const unreferencedVars: Set<string> = new Set(vars.map((v) => variableName(v)));

  msgs.forEach((msg) => scanForReferencesForWarpMsg(msg).forEach((varName) => referencedVars.add(varName)));

  vars.forEach((v) => {
    if ('query' in v) {
      const q = decodeQuery(v.query.init_fn.query);
      scanForReferences(q).forEach((varName) => referencedVars.add(varName));
    }
  });

  vars.forEach((v) => {
    scanForReferencesForUpdateFn(v).forEach((varName) => referencedVars.add(varName));
  });

  if (condition) {
    scanForReferences(condition).forEach((v) => referencedVars.add(v));
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

const scanForReferencesForWarpMsg = (msg: warp_resolver.WarpMsg): string[] => {
  const obj = decodeMsg(msg);
  return scanForReferences(obj);
};

function scanForReferencesForUpdateFn(variable: warp_resolver.Variable): Set<string> {
  const referencedVars: Set<string> = new Set();

  let update_fn = updateFn(variable);

  if (update_fn) {
    ['on_success', 'on_error'].forEach((key) => {
      const updateFnValue = update_fn![key as 'on_success' | 'on_error'];

      if (updateFnValue) {
        scanForReferences(updateFnValue).forEach((varName) => referencedVars.add(varName));
      }
    });
  }

  return referencedVars;
}

function updateFn(variable: warp_resolver.Variable): warp_resolver.UpdateFn | null | undefined {
  if ('static' in variable) {
    return variable.static.update_fn;
  }

  if ('query' in variable) {
    return variable.query.update_fn;
  }

  if ('external' in variable) {
    return variable.external.update_fn;
  }
}

// Helper function to perform Depth First Search on the graph
function dfs(graph: Map<string, Set<string>>, node: string, visited: Set<string>, result: string[]): void {
  if (visited.has(node)) return;
  visited.add(node);
  const neighbors = graph.get(node) || new Set();
  neighbors.forEach((neighbor) => dfs(graph, neighbor, visited, result));
  result.push(node); // Post-order addition to result, ensuring dependencies are listed before dependents
}

export function orderVarsByReferencing(vars: warp_resolver.Variable[]): warp_resolver.Variable[] {
  // Build a map where keys are variable names and values are sets of names of variables they reference
  const graph = new Map<string, Set<string>>();

  vars.forEach((variable) => {
    const varName = variableName(variable);
    const referencedVarNames = new Set<string>();

    if ('query' in variable) {
      const q = decodeQuery(variable.query.init_fn.query);
      scanForReferences(q).forEach((varName) => referencedVarNames.add(varName));
    }

    scanForReferencesForUpdateFn(variable).forEach((varName) => referencedVarNames.add(varName));

    graph.set(varName, referencedVarNames);
  });

  // Perform DFS to order variables
  const visited = new Set<string>();
  const result: string[] = [];
  graph.forEach((_, node) => dfs(graph, node, visited, result));

  // Convert ordered variable names back to variable objects
  return result
    .map((varName) => vars.find((v) => variableName(v) === varName))
    .filter(Boolean) as warp_resolver.Variable[];
}
