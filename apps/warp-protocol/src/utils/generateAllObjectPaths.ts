export function generateAllObjectPaths(jsonObj: any, path = ''): string[] {
  if (typeof jsonObj === 'object' && jsonObj !== null) {
    if (Array.isArray(jsonObj)) {
      return jsonObj.flatMap((item, i) => {
        return generateAllObjectPaths(item, path + '[' + i + ']');
      });
    }
    return Object.keys(jsonObj).flatMap((key) => {
      return generateAllObjectPaths(jsonObj[key], path + '.' + key);
    });
  }

  return [path];
}

export const parseJsonValue = (str?: string) => {
  let value = undefined;

  try {
    value = str ? JSON.parse(str) : undefined;
  } catch (e) {}

  return value;
};

export const generatePaths = (msg: string) => {
  const messageJson = parseJsonValue(msg);
  const paths = messageJson ? generateAllObjectPaths(messageJson, '$') : [];

  return paths;
};
