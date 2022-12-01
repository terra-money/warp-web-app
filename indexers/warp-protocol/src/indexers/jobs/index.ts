import { Runner, Scheduler } from "@apps-shared/indexers/indexers";
import { StateTableInitializer } from "@apps-shared/indexers/initializers";
import { JobsTableInitializer } from "initializers";
import { Environment } from "utils";
import { Indexer } from "./Indexer";

Environment.load();

new Runner(
  Scheduler.wrap(new Indexer(), "INTERVAL_JOBS"),
  new StateTableInitializer(),
  new JobsTableInitializer()
)
  .run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
