import { CreateTableCommandInput } from '@aws-sdk/client-dynamodb';
import { TableNames } from './TableNames';
import { TableInitializer } from '@apps-shared/indexers/initializers';

export const PK_NAME = 'pk';

export const SK_NAME = 'sk';

export class AccountsTableInitializer extends TableInitializer {
  constructor(chainName: string, tableName: string = TableNames.jobs(chainName)) {
    super({ tableName });
  }

  createTableDefinition(tableName: string): CreateTableCommandInput {
    return {
      TableName: tableName,
      KeySchema: [
        {
          AttributeName: PK_NAME,
          KeyType: 'HASH',
        },
        {
          AttributeName: SK_NAME,
          KeyType: 'RANGE',
        },
      ],
      AttributeDefinitions: [
        {
          AttributeName: PK_NAME,
          AttributeType: 'S',
        },
        {
          AttributeName: SK_NAME,
          AttributeType: 'S',
        },
        {
          AttributeName: 'owner',
          AttributeType: 'S',
        },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'idx-owner',
          KeySchema: [
            {
              AttributeName: 'owner',
              KeyType: 'HASH',
            },
            {
              AttributeName: SK_NAME,
              KeyType: 'RANGE',
            },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 3,
            WriteCapacityUnits: 3,
          },
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 3,
        WriteCapacityUnits: 3,
      },
    };
  }
}
