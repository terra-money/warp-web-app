import { makeTableName } from "utils";

export class TableNames {
  static state(chainName: string) {
    return makeTableName("state", chainName);
  }
  static events(chainName: string) {
    return makeTableName("events", chainName);
  }
}
