import { u } from 'shared/types';
import Big from 'big.js';
import { Sort } from 'components/table-widget';
import { SortDirection } from 'react-virtualized';
import { Job } from 'types/job';

export type SortBy = 'reward' | 'id' | 'name' | 'reward' | 'status';

export const applySort = (jobs: Job[], sort?: Sort<SortBy>): Job[] =>
  !sort ? jobs : [...jobs].sort(sortCompare(sort));

export const sortCompare = (sort: Sort<SortBy>) => (a: Job, b: Job) => {
  let compareResult = 0;

  switch (sort.sortBy) {
    case 'name':
      compareResult = b.info.name.localeCompare(a.info.name);
      break;
    case 'id':
      compareResult = b.info.id.localeCompare(a.info.id);
      break;
    case 'reward':
      compareResult = a.reward.gte(b.reward ?? (Big(0) as u<Big>)) ? 1 : -1;
      break;
    case 'status':
      compareResult = a.info.status.localeCompare(b.info.status);
      break;
  }

  return sort.direction === SortDirection.ASC ? compareResult : -1 * compareResult;
};
