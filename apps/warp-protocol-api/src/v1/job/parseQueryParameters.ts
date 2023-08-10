import {
  parseQueryString,
} from "@apps-shared/api/utils";
import { QueryParamConfigMap, StringParam, withDefault } from "serialize-query-params";
import { ParsedQs } from "qs";

interface QueryStringParameters {
  chain: string;
}

export const parseQueryParameters = (
  query: ParsedQs
): QueryStringParameters => {
  const definition: QueryParamConfigMap = {
    chain: withDefault(StringParam, 'terra'),
  };

  return parseQueryString<QueryStringParameters>(query, definition);
};
