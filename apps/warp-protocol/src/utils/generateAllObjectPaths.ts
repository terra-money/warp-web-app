export function isObject(value: any): value is Object {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function generateAllPaths(prefix: string, object: any): string[] {
  const paths: string[] = [];

  if (!isObject(object)) {
    return [prefix];
  }

  Object.keys(object).forEach((key) => {
    const val = object[key];
    const path = `${prefix}.${key}`;

    if (isObject(val)) {
      paths.push(...generateAllPaths(path, val as {}));
    } else {
      paths.push(path);
    }
  });

  return paths;
}
