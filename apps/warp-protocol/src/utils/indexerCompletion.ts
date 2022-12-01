import { sleep } from '@terra-money/apps/utils';
import { NetworkInfo } from '@terra-money/wallet-provider';
import { TX_KEY } from 'tx';
import { fetchIndexerState } from './fetchIndexerState';
import { min } from 'd3-array';

interface IndexerCompletionOptions {
  network: NetworkInfo;
  height: number;
  timeout?: number;
  txKey: TX_KEY;
  callback: () => void;
}

// TODO: could be smarter here and map the required indexers to TX_KEY
const INDEXER_KEYS = ['indexer:warp-jobs', 'indexer:warp-jobs-tx-history'];

export const indexerCompletion = async (options: IndexerCompletionOptions): Promise<void> => {
  const { network, height, timeout = 10000, callback } = options;

  const now = Date.now();

  while (Date.now() < now + timeout) {
    const state = await fetchIndexerState(network);

    // wait for all of the required indexers to process the block
    const minHeight = min(
      state.filter((s) => INDEXER_KEYS.includes(s.pk)),
      (v) => v.height
    );

    if (minHeight && minHeight >= height) {
      break;
    }

    await sleep(1000);
  }

  callback();
};
