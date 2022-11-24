import { useQuery, UseQueryResult } from 'react-query';
import { QUERY_KEY } from './queryKey';
import { useMemo } from 'react';
import Big from 'big.js';

type LatestBlockResponse = {
  block: Block;
};

interface Block {
  header: {
    version: {
      block: string;
    };
    chain_id: string;
    height: string;
    time: Date;
    last_block_id: {
      hash: string;
      parts: {
        total: number;
        hash: string;
      };
    };
    last_commit_hash: string;
    data_hash: string;
    validators_hash: string;
    next_validators_hash: string;
    consensus_hash: string;
    app_hash: string;
    last_results_hash: string;
    evidence_hash: string;
    proposer_address: string;
  };
  data: { txs: string[] };
}

export const useBlockHeightQuery = (): UseQueryResult<Big | undefined> => {
  const time = useMemo(() => new Date().getTime(), []);

  return useQuery(
    [QUERY_KEY.BLOCK_HEIGHT, time],
    async ({ queryKey }) => {
      const res = await fetch('https://phoenix-lcd.terra.dev/blocks/latest');
      const data = (await res.json()) as LatestBlockResponse;

      return Big(data.block.header.height);
    },
    {
      keepPreviousData: false,
      refetchOnMount: false,
    }
  );
};
