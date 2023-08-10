import {
  HttpError,
  parseQueryString,
  withLimitParam,
} from "@apps-shared/api/utils";
import { QueryParamConfigMap, StringParam, withDefault } from "serialize-query-params";
import { ParsedQs } from "qs";

interface QueryStringParameters {
  owner?: string;
  limit: number;
  chain: string;
}

export const parseQueryParameters = (
  query: ParsedQs
): QueryStringParameters => {
  const definition: QueryParamConfigMap = {
    owner: StringParam,
    limit: withLimitParam(),
    chain: withDefault(StringParam, 'terra')
  };

  const validation = (params: QueryStringParameters): QueryStringParameters => {
    if (params.owner === undefined) {
      throw HttpError.badRequest("Must provide the owner");
    }
    return params;
  };

  return parseQueryString<QueryStringParameters>(query, definition, validation);
};
