import {
  TableNames,
  JOBS_PK_NAME,
  JOBS_SK_NAME,
} from "@warp-protocol/indexers/src/initializers";
import { fetch, HttpError } from "@apps-shared/api/utils";
import { RequestHandler } from "express";
import { createDynamoDBClient } from "@apps-shared/indexers/utils";

export const get: RequestHandler = async (request, response) => {
  const dynamoDBClient = createDynamoDBClient();

  const { id } = request.params;

  const job = await fetch(dynamoDBClient, {
    TableName: TableNames.jobs(),
    Key: {
      [JOBS_PK_NAME]: {
        S: id,
      },
      [JOBS_SK_NAME]: {
        S: "job",
      },
    },
  });

  if (job !== undefined) {
    response.json(job);
    return;
  }

  throw HttpError.notFound();
};
