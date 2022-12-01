import { useContractAddress } from '@terra-money/apps/hooks';
import { useTx, TxBuilder } from '@terra-money/apps/libs/transactions';
import { warp_controller } from '../types/contracts';
import { LUNA, u } from '@terra-money/apps/types';
import Big from 'big.js';
import { TX_KEY } from './txKey';
import { useWarpAccount } from 'queries/useWarpAccount';
import { useEffect, useRef } from 'react';
import { useWarpConfig } from 'queries/useConfigQuery';

export interface CreateJobTxProps {
  name: string;
  reward: u<Big>;
  msgs: warp_controller.CosmosMsgFor_Empty[];
  condition: warp_controller.Condition;
}

type CreateJobMsg = Extract<warp_controller.ExecuteMsg, { create_job: {} }>;

export const useCreateJobTx = () => {
  const contractAddress = useContractAddress('warp-controller');
  const { data: account } = useWarpAccount();
  const { data: config } = useWarpConfig();

  const accountRef = useRef<warp_controller.Account | undefined>();
  const configRef = useRef<warp_controller.Config | undefined>();

  useEffect(() => {
    accountRef.current = account;
    configRef.current = config;
  }, [account, config]);

  return useTx<CreateJobTxProps>(
    (options) => {
      const { wallet, reward, name, msgs, condition } = options;

      let txBuilder = TxBuilder.new();

      if (!accountRef.current || !configRef.current) {
        return { msgs: [] };
      }

      return txBuilder
        .send(accountRef.current.owner, accountRef.current.account, {
          [LUNA.denom]: reward.mul(Big(configRef.current.creation_fee_percentage).add(100).div(100)).toString(),
        })
        .execute<CreateJobMsg>(wallet.walletAddress, contractAddress, {
          create_job: {
            name,
            condition: condition,
            reward: reward.toString(),
            msgs: msgs.map((msg) => JSON.stringify(msg)),
          },
        })
        .build();
    },
    {
      txKey: TX_KEY.CREATE_JOB,
    }
  );
};
