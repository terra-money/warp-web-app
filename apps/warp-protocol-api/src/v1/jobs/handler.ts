import {
  JOBS_SK_NAME,
  TableNames,
} from "@warp-protocol/indexers/src/initializers";
import { fetchAll } from "@apps-shared/api/utils";
import { Entity } from "@warp-protocol/indexers/src/indexers/jobs/types";
import { RequestHandler } from "express";
import { parseQueryParameters } from "./parseQueryParameters";
import { createDynamoDBClient } from "@apps-shared/indexers/utils";

export const get: RequestHandler = async (request, response): Promise<void> => {
  const params = parseQueryParameters(request.query);

  const dynamoDBClient = createDynamoDBClient();

  const jobs = await fetchAll<Entity>(dynamoDBClient, {
    TableName: TableNames.jobs(params.chain),
    IndexName: "idx-owner",
    Limit: params.limit,
    KeyConditionExpression: `#a = :a and ${JOBS_SK_NAME} = :b`,
    ExpressionAttributeNames: {
      "#a": "owner",
    },
    ExpressionAttributeValues: {
      ":a": { S: params.owner },
      ":b": { S: "job" },
    },
  });

  if (jobs !== undefined) {
    response.json(jobs);
    return;
  }

  response.sendStatus(404);
};
