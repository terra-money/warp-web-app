import { TableNames } from "initializers";
import { DynamoDBState, State } from "../services/state";
import { createDynamoDBClient } from "./createDynamoDBClient";

export const createState = (
  keyName: string,
  chainName: string,
  tableName: string = TableNames.state(chainName)
): State => {
  return new DynamoDBState({
    keyName,
    tableName,
    dynamoClient: createDynamoDBClient(),
  });
};
