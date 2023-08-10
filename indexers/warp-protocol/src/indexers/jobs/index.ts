import { Runner, Scheduler } from '@apps-shared/indexers/indexers';
import { StateTableInitializer } from '@apps-shared/indexers/initializers';
import { JobsTableInitializer } from 'initializers';
import { Environment } from 'utils';
import { Indexer } from './Indexer';

Environment.load();

const run = async (chainName: string) => {
  new Runner(
    Scheduler.wrap(new Indexer(chainName), 'INTERVAL_JOBS'),
    new StateTableInitializer(chainName),
    new JobsTableInitializer(chainName)
  )
    .run()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
};

Environment.chain.supportedChains().forEach((chain) => run(chain.name));
