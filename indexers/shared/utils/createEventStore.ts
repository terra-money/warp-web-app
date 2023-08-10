import { TableNames } from "initializers";
import { DynamoDBEventStore, EventStore } from "../services/event-store";
import { createDynamoDBClient } from "./createDynamoDBClient";

export const createEventStore = (
  chainName: string,
  tableName: string = TableNames.events(chainName)
): EventStore => {
  return new DynamoDBEventStore({
    tableName,
    dynamoClient: createDynamoDBClient(),
  });
};
