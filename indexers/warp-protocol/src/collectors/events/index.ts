import { EventCollector } from '@apps-shared/indexers/collectors';
import { EventStoreTableInitializer, StateTableInitializer } from '@apps-shared/indexers/initializers';
import { Runner } from '@apps-shared/indexers/indexers';
import {
  createDynamoDBClient,
  createEventStore,
  createLCDClient,
  createState,
  fetchAll,
} from '@apps-shared/indexers/utils';
import { BlockListener } from '@apps-shared/indexers/services/block-listener';
import { Environment } from 'utils';
import { Runnable } from '@apps-shared/indexers/services/runnable';
import { AccountsTableInitializer, TableNames } from 'initializers';

const blockListener = new BlockListener({
  lcd: createLCDClient(),
});

const eventStore = createEventStore();

const state = createState('collector:warp-events');

const genesis = Environment.getGenesis();

const warpControllerAddress = Environment.getContractAddress('warp-controller');

class EnterpriseEventCollector implements Runnable {
  private warpAccountAddresses: string[] = [];

  async initialize() {
    const dynamoDBClient = createDynamoDBClient();

    // const response = await fetchAll<{ address: string }>(dynamoDBClient, {
    //   TableName: TableNames.accounts(),
    //   IndexName: 'idx-dao-name',
    //   Limit: 100000,
    //   KeyConditionExpression: `#a = :a`,
    //   ExpressionAttributeNames: {
    //     '#a': '_type',
    //   },
    //   ExpressionAttributeValues: {
    //     ':a': { S: 'dao' },
    //   },
    //   ProjectionExpression: 'pk',
    // });

    //this.warpAccountAddresses = [...this.warpAccountAddresses, ...response.map((a) => a.pk)];

    this.warpAccountAddresses = [...this.warpAccountAddresses];
  }

  async run(): Promise<void> {
    await this.initialize();

    const eventCollector = new EventCollector({
      genesis,
      blockListener,
      monikers: (contractAddress: string) => {
        return contractAddress === warpControllerAddress
          ? 'warp-controller'
          : this.warpAccountAddresses.includes(contractAddress)
          ? 'warp-account'
          : undefined;
      },
      onEvent: (event) => {
        if (event.contract === 'warp-controller' && event.action === 'save_account') {
          if (event.payload['account_address']) {
            this.warpAccountAddresses.push(event.payload['account_address']);
          }
        }
      },
      eventStore,
      state,
    });

    await eventCollector.run();
  }
}

const runnable = new EnterpriseEventCollector();

new Runner(runnable, new StateTableInitializer(), new EventStoreTableInitializer(), new AccountsTableInitializer())
  .run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
