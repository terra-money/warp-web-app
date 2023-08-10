import { EventIndexer, IndexFnOptions } from 'indexers/EventIndexer';
import { TableNames, JOBS_PK_NAME, JOBS_SK_NAME } from 'initializers';
import { batch } from '@apps-shared/indexers/utils';
import { KeySelector } from '@apps-shared/indexers/services/persistence';
import { EventPK, Event, fetchByHeight } from '@apps-shared/indexers/services/event-store';
import {
  CreateJobEntity,
  DeleteJobEntity,
  Entity,
  ExecuteJobEntity,
  PrioritizeJobEntity,
  UpdateJobEntity,
} from './types';
import {
  CreateJobEvent,
  DeleteJobEvent,
  ExecuteJobEvent,
  PrioritizeJobEvent,
  UpdateJobEvent,
  WarpPK,
} from 'types/events';

export const PK: KeySelector<Entity> = (data) => data.job_id;

export const SK: KeySelector<Entity> = (data) => `tx:${data.timestamp}`;

export class Indexer extends EventIndexer<Entity> {
  chainName: string;

  constructor(chainName: string) {
    super({
      name: 'jobs-tx-history',
      tableName: TableNames.jobs(chainName),
      pk: PK,
      sk: SK,
      pkName: JOBS_PK_NAME,
      chainName,
      skName: JOBS_SK_NAME,
    });

    this.chainName = chainName;
  }

  private update = async <InputEvent extends Event, OutputEntity extends Entity>(
    eventPk: EventPK,
    min: number,
    max: number,
    mapper: (event: InputEvent) => Array<OutputEntity>
  ): Promise<void> => {
    const events = await fetchByHeight(this.events, eventPk, min, max, mapper);

    await this.persistence.save(events.filter((e) => e.job_id));
  };

  static mapCreateJob = (event: CreateJobEvent): Array<CreateJobEntity> => {
    return [
      {
        type: 'create_job',
        job_id: event.payload.job_id,
        timestamp: event.timestamp,
        txHash: event.txHash,
        name: event.payload.name,
        owner: event.payload.owner,
      },
    ];
  };

  static mapDeleteJob = (event: DeleteJobEvent): Array<DeleteJobEntity> => {
    return [
      {
        type: 'delete_job',
        job_id: event.payload.job_id,
        timestamp: event.timestamp,
        txHash: event.txHash,
      },
    ];
  };

  static mapExecuteJob = (event: ExecuteJobEvent): Array<ExecuteJobEntity> => {
    return [
      {
        type: 'execute_job',
        job_id: event.payload.job_id,
        timestamp: event.timestamp,
        txHash: event.txHash,
      },
    ];
  };

  static mapUpdateJob = (event: UpdateJobEvent): Array<UpdateJobEntity> => {
    return [
      {
        type: 'update_job',
        job_id: event.payload.job_id,
        timestamp: event.timestamp,
        txHash: event.txHash,
      },
    ];
  };

  static mapPrioritizeJob = (event: PrioritizeJobEvent): Array<PrioritizeJobEntity> => {
    return [
      {
        type: 'prioritize_job',
        job_id: event.payload.job_id,
        timestamp: event.timestamp,
        txHash: event.txHash,
      },
    ];
  };

  override index = async (options: IndexFnOptions): Promise<void> => {
    const { current, genesis } = options;

    let { height } = await this.state.get({ height: genesis.height });

    await batch(height, current.height, 1000, async ({ min, max }) => {
      this.logger.info(`Processing blocks between ${min} and ${max}.`);

      await this.update<CreateJobEvent, CreateJobEntity>(
        WarpPK.controller('create_job'),
        min,
        max,
        Indexer.mapCreateJob
      );

      await this.update<UpdateJobEvent, UpdateJobEntity>(
        WarpPK.controller('update_job'),
        min,
        max,
        Indexer.mapUpdateJob
      );

      await this.update<DeleteJobEvent, DeleteJobEntity>(
        WarpPK.controller('delete_job'),
        min,
        max,
        Indexer.mapDeleteJob
      );

      await this.update<ExecuteJobEvent, ExecuteJobEntity>(
        WarpPK.controller('execute_job'),
        min,
        max,
        Indexer.mapExecuteJob
      );

      await this.update<PrioritizeJobEvent, PrioritizeJobEntity>(
        WarpPK.controller('prioritize_job'),
        min,
        max,
        Indexer.mapPrioritizeJob
      );

      await this.state.set({ height: max });
    });
  };
}
