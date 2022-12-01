import { makeTableName } from '@apps-shared/indexers/utils';

export class TableNames {
  static analytics() {
    return makeTableName('analytics');
  }
  static jobs() {
    return makeTableName('jobs');
  }
  static accounts() {
    return makeTableName('accounts');
  }
}
