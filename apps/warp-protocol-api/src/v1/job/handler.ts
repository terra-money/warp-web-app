import {
  TableNames,
  JOBS_PK_NAME,
  JOBS_SK_NAME,
} from "@warp-protocol/indexers/src/initializers";
import { fetch, HttpError } from "@apps-shared/api/utils";
import { RequestHandler } from "express";
import { createDynamoDBClient } from "@apps-shared/indexers/utils";
import { parseQueryParameters } from "./parseQueryParameters";

export const get: RequestHandler = async (request, response) => {
  const dynamoDBClient = createDynamoDBClient();

  const { id } = request.params;

  const params = parseQueryParameters(request.query);

  const job = await fetch(dynamoDBClient, {
    TableName: TableNames.jobs(params.chain),
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
