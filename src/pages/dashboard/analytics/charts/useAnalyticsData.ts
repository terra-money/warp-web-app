import { AnalyticsTypeName, useAnalyticsQuery } from 'queries';
import { format, subDays } from 'date-fns';
import { createPaddedArray, Frequency, mergeArray } from 'utils';
import { useMemo } from 'react';
import Big from 'big.js';

export const useAnalyticsData = (
  type: AnalyticsTypeName,
  frequency: Frequency = 'daily',
  limit: number = 7,
  padded: boolean = true
) => {
  const { data = [], isLoading } = useAnalyticsQuery(type, limit, frequency);

  return useMemo(() => {
    const d =
      padded === false
        ? data
        : mergeArray(
            createPaddedArray(limit, frequency),
            data.map(({ timestamp, value }) => {
              return {
                timestamp,
                value,
              };
            })
          );

    const values = d.map((v) => Big(v.value ?? 0).toNumber());

    const labels = Array.from({ length: d.length }, (_, idx) => format(subDays(new Date(), idx), 'E'));

    return {
      values,
      labels,
      total: values.reduce((previous, current) => previous.add(current), Big(0)),
      isLoading,
    };
  }, [data, isLoading, frequency, limit, padded]);
};
