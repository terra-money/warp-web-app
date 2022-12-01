import { fetch, fetchAll, HttpError } from "@apps-shared/api/utils";
import { Entity as JobEntity } from "@warp-protocol/indexers/src/indexers/jobs/types";
import { Entity } from "@warp-protocol/indexers/src/indexers/jobs-tx-history/types";
import {
  TableNames,
  JOBS_PK_NAME,
  JOBS_SK_NAME,
} from "@warp-protocol/indexers/src/initializers";
import { RequestHandler } from "express";
import { parseQueryParameters } from "./parseQueryParameters";
import { createDynamoDBClient } from "@apps-shared/indexers/utils";

export const get: RequestHandler = async (request, response) => {
  const params = parseQueryParameters(request.query);

  const dynamoDBClient = createDynamoDBClient();

  const { id } = request.params;

  // TODO: can include this in the same query as the history
  const job = await fetch<JobEntity>(dynamoDBClient, {
    TableName: TableNames.jobs(),
    Key: {
      [JOBS_PK_NAME]: { S: id },
      [JOBS_SK_NAME]: {
        S: "job",
      },
    },
  });

  if (job === undefined) {
    // we need to pull the asset information from the job
    // so we can assume for now that if the job doesn't
    // exists then nethier does the history
    throw HttpError.notFound();
  }

  const entities = await fetchAll<Entity>(dynamoDBClient, {
    TableName: TableNames.jobs(),
    Limit: params.limit,
    ScanIndexForward: params.direction !== "desc",
    KeyConditions: {
      [JOBS_PK_NAME]: {
        AttributeValueList: [{ S: id }],
        ComparisonOperator: "EQ",
      },
      [JOBS_SK_NAME]: {
        AttributeValueList: [{ S: "tx:" }],
        ComparisonOperator: "BEGINS_WITH",
      },
    },
  });

  response.json(
    entities.map((entity) => {
      return {
        ...entity,
      };
    })
  );
};
