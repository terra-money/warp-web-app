interface Entity {
  timestamp: number;
}

export const mergeArray = <T extends Entity>(timestamps: number[], data: T[]): T[] => {
  const lookup = new Map<number, Entity>(data.map((v) => [v.timestamp, v]));

  return timestamps.map((timestamp) => {
    return {
      ...lookup.get(timestamp),
      timestamp,
    } as T;
  });
};
