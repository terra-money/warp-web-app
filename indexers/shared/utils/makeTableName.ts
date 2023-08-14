import dotenv from "dotenv";
dotenv.config();

export const makeTableName = (tableName: string, chainName: string): string => {
  if (process.env.TABLE_PREFIX) {
    if (chainName === 'terra') {
      return `${process.env.TABLE_PREFIX}-${tableName}`;
    }

    return `${process.env.TABLE_PREFIX}-${chainName}-${tableName}`;
  }
  return tableName;
};
