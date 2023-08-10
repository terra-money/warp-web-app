import { makeTableName } from '@apps-shared/indexers/utils';

export class TableNames {
  static analytics(chainName: string) {
    return makeTableName('analytics', chainName);
  }
  static jobs(chainName: string) {
    return makeTableName('jobs', chainName);
  }
  static accounts(chainName: string) {
    return makeTableName('accounts', chainName);
  }
}
