import { useRefCallback } from '@terra-money/apps/hooks';
import { sleep } from '@terra-money/apps/utils';
import { useQueryClient } from 'react-query';
import { TX_KEY } from 'tx';
import { QUERY_KEY } from './queryKey';

interface QueryRefetch {
  queryKey: QUERY_KEY;
  wait?: number;
}

type QueryRefetchMap = Record<TX_KEY, (QUERY_KEY | QueryRefetch)[]>;

const QUERY_REFETCH_MAP: QueryRefetchMap = {
  [TX_KEY.CREATE_JOB]: [QUERY_KEY.JOBS],
  [TX_KEY.EDIT_JOB]: [QUERY_KEY.JOBS],
  [TX_KEY.CANCEL_JOB]: [QUERY_KEY.JOBS],
  [TX_KEY.EXECUTE_JOB]: [QUERY_KEY.JOBS],
  [TX_KEY.ADD_FUNDS]: [QUERY_KEY.BALANCE],
  [TX_KEY.WITHDRAW_FUNDS]: [QUERY_KEY.BALANCE],
  [TX_KEY.CREATE_ACCOUNT]: [QUERY_KEY.WARP_ACCOUNT],
  [TX_KEY.CREATE_TEMPLATE]: [QUERY_KEY.TEMPLATES],
  [TX_KEY.EDIT_TEMPLATE]: [QUERY_KEY.TEMPLATES],
  [TX_KEY.DELETE_TEMPLATE]: [QUERY_KEY.TEMPLATES],
  [TX_KEY.CREATE_FUNDING_ACCOUNT]: [QUERY_KEY.FUNDING_ACCOUNTS],
};

const runRefetch = (queryRefetch: string | QueryRefetch): Promise<string> => {
  return new Promise<string>((resolve) => {
    if (typeof queryRefetch === 'string') {
      // we cant query right away because we need to give the nodes
      // time to sync before the data is available to requery
      sleep(600).then(() => resolve(queryRefetch));
    } else if (typeof queryRefetch.wait === 'number') {
      sleep(queryRefetch.wait).then(() => resolve(queryRefetch.queryKey));
    } else {
      resolve(queryRefetch.queryKey);
    }
  });
};

export const useRefetchQueries = () => {
  const queryClient = useQueryClient();

  return useRefCallback(
    (txKey: TX_KEY) => {
      if (QUERY_REFETCH_MAP[txKey]) {
        for (const queryRefetch of QUERY_REFETCH_MAP[txKey]) {
          runRefetch(queryRefetch).then((queryKey) => {
            queryClient.invalidateQueries(queryKey, {
              refetchActive: true,
              refetchInactive: false,
            });
            // TODO: check why this works at all
            queryClient.refetchQueries(queryKey);
          });
        }
      }
    },
    [queryClient]
  );
};
