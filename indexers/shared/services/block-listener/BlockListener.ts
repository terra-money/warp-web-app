import { BlockInfo, LCDClient, TxInfo } from '@terra-money/feather.js';
import axios from 'axios';
import { Timestamp } from 'types';
import { Logger, sleep } from 'utils';
import { Block } from './types';

type AsyncCallback = (blockPromises: Promise<Block>[]) => Promise<void>;

type BlockListenerOptions = {
  lcd: LCDClient;
  chainId: string;
  batchSize: number;
};

export class BlockListener {
  private readonly logger: Logger;
  private readonly lcd: LCDClient;

  public chainId: string;
  public batchSize: number;

  constructor(options: BlockListenerOptions) {
    this.logger = new Logger('BlockListener');
    this.lcd = options.lcd;
    this.chainId = options.chainId;
    this.batchSize = options.batchSize;
  }

  private wait = async (height: number): Promise<[BlockInfo, TxInfo[]]> => {
    let block: BlockInfo;

    while (true) {
      try {
        const [block, txs] = await Promise.all([
          this.lcd.tendermint.blockInfo(this.chainId, height),
          this.lcd.tx.txInfosByHeight(this.chainId, height),
        ]);

        if (block === null || block === undefined) {
          await sleep(1000);
          continue;
        }

        return [block, txs];
      } catch (err) {
        if (axios.isAxiosError(err) && err.response.status === 400) {
          // likely the block doesn't exist so we skip writing this as an error
          await sleep(1000);
          continue;
        }
        if (
          err.response &&
          err.response.data &&
          err.response.data.message &&
          err.response.data.message.includes('json: error calling MarshalJSON for type types.RawContractMessage:')
        ) {
          this.logger.error(`Corrupted transaction @ height: ${height} "${err.response.data.message}"`);
          return [block, []];
        }
        this.logger.error(`Error waiting for block ${height} "${err.toString()}"`);
        await sleep(1000);
      }
    }
  };

  private fetchBlock = async (height: number): Promise<Block> => {
    const [blockInfo, txs] = await this.wait(height);

    return {
      height: height,
      timestamp: Timestamp.from(blockInfo.block.header.time).toNumber(),
      txs: txs
        .filter((tx) => tx.logs)
        .map((tx) => {
          return {
            txHash: tx.txhash,
            timestamp: Timestamp.from(tx.timestamp).toNumber(),
            logs: tx.logs.map((log) => {
              return {
                msgIndex: log.msg_index,
                events: log.events,
              };
            }),
          };
        }),
    };
  };

  listen = async (startHeight: number, callback: AsyncCallback) => {
    while (true) {
      const heights = Array.from({ length: this.batchSize }, (_, i) => startHeight + i);
      const blockPromises = heights.map((height) => this.fetchBlock(height));

      try {
        await callback(blockPromises);
        startHeight += this.batchSize;
      } catch (error) {
        this.logger.error('Failed to execute the callback');
        await sleep(1000);
      }
    }
  };
}
