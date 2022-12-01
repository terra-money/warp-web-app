import { Entity } from "@warp-protocol/indexers/src/indexers/analytics/types";
import {
  TableNames,
  ANALYTICS_PK_NAME,
} from "@warp-protocol/indexers/src/initializers";
import { fetchAll } from "@apps-shared/api/utils";
import { RequestHandler } from "express";
import { parseQueryParameters } from "./parseQueryParameters";
import { createDynamoDBClient } from "@apps-shared/indexers/utils";

export const get: RequestHandler = async (request, response) => {
  const params = parseQueryParameters(request.query);

  const pk = `warp:${params.type}:${params.frequency}`;

  const dynamoDBClient = createDynamoDBClient();

  const entities = await fetchAll<Entity>(dynamoDBClient, {
    TableName: TableNames.analytics(),
    KeyConditions: {
      [ANALYTICS_PK_NAME]: {
        AttributeValueList: [{ S: pk }],
        ComparisonOperator: "EQ",
      },
    },
    ScanIndexForward: params.direction !== "desc",
    Limit: params.limit,
  });

  response.json(
    entities.map((e) => {
      return {
        timestamp: e.timestamp,
        value: e.value,
      };
    })
  );
};
