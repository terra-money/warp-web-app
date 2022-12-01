import {
  Direction,
  Frequency,
  parseQueryString,
  withDirectionParam,
  withLimitParam,
  withFrequencyParam,
} from "@apps-shared/api/utils";
import {
  QueryParamConfigMap,
  StringParam,
  withDefault,
} from "serialize-query-params";
import { ParsedQs } from "qs";

interface QueryStringParameters {
  frequency: Frequency;
  limit: number;
  direction: Direction;
  type: string;
}

export const parseQueryParameters = (
  query: ParsedQs
): QueryStringParameters => {
  const definition: QueryParamConfigMap = {
    frequency: withFrequencyParam(),
    limit: withLimitParam(),
    direction: withDirectionParam(),
    type: withDefault(StringParam, "total"),
  };

  return parseQueryString<QueryStringParameters>(query, definition);
};
