import { EventIndexer, IndexFnOptions } from 'indexers/EventIndexer';
import { Entity } from './types';
import { LCDClient } from '@terra-money/feather.js';
import { TableNames, JOBS_PK_NAME, JOBS_SK_NAME } from 'initializers';
import { batch } from '@apps-shared/indexers/utils';
import { KeySelector } from '@apps-shared/indexers/services/persistence';
import { fetchByHeight } from '@apps-shared/indexers/services/event-store';
import { Environment } from 'utils';
import { WarpControllerJobEvents, WarpPK } from 'types/events';
import { warp_controller } from 'types/contracts';

export const PK: KeySelector<Entity> = (data) => data.id;

export const SK = 'job';

export class Indexer extends EventIndexer<Entity> {
  chainName: string;

  constructor(chainName: string) {
    super({
      name: 'jobs',
      tableName: TableNames.jobs(chainName),
      pk: PK,
      pkName: JOBS_PK_NAME,
      sk: SK,
      chainName,
      skName: JOBS_SK_NAME,
    });

    this.chainName = chainName;
  }

  private getModifiedJobIds = async (min: number, max: number): Promise<Array<string>> => {
    const pks = [
      WarpPK.controller('create_job'),
      WarpPK.controller('update_job'),
      WarpPK.controller('execute_job'),
      WarpPK.controller('delete_job'),
      WarpPK.controller('prioritize_job'),
    ];

    const promises = await Promise.all(
      pks.map((pk) =>
        fetchByHeight<WarpControllerJobEvents, string>(this.events, pk, min, max, (event) => [event.payload.job_id])
      )
    );

    return Array.from(new Set<string>(promises.flatMap((s) => s))).filter(Boolean);
  };

  private fetchJob = async (lcd: LCDClient, contractAddress: string, jobId: string): Promise<Entity> => {
    const response = await lcd.wasm.contractQuery<warp_controller.JobResponse>(contractAddress, {
      query_job: { id: jobId },
    });

    return {
      id: response.job.id,
      name: response.job.name,
      owner: response.job.owner,
    };
  };

  private synchronize = async (jobIds: string[]): Promise<void> => {
    const lcd = Environment.lcd;

    const contractAddress = Environment.getContractAddress(this.chainName, 'controller');

    const jobs = [];

    for (let jobId of jobIds) {
      try {
        jobs.push(await this.fetchJob(lcd, contractAddress, jobId));
      } catch (error) {
        this.logger.error(error);
      }
    }

    await this.persistence.save(jobs);
  };

  override index = async (options: IndexFnOptions): Promise<void> => {
    const { current, genesis } = options;

    let { height } = await this.state.get({ height: genesis.height });

    await batch(height, current.height, 1000, async ({ min, max }) => {
      this.logger.info(`Processing blocks between ${min} and ${max}.`);

      await this.synchronize(await this.getModifiedJobIds(min, max));

      await this.state.set({ height: max });
    });
  };
}
