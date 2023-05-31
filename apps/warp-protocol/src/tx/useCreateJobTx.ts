import { useContractAddress } from '@terra-money/apps/hooks';
import { useTx, TxBuilder } from '@terra-money/apps/libs/transactions';
import { warp_controller } from '../types/contracts';
import { LUNA, u } from '@terra-money/apps/types';
import Big from 'big.js';
import { TX_KEY } from './txKey';
import { useWarpAccount } from 'queries/useWarpAccount';
import { useEffect, useRef } from 'react';
import { useWarpConfig } from 'queries/useConfigQuery';
import { containsAllReferencedVarsInCosmosMsg } from 'utils/msgs';

export interface CreateJobTxProps {
  name: string;
  reward: u<Big>;
  msgs: warp_controller.CosmosMsgFor_Empty[];
  vars: warp_controller.Variable[];
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
      const { wallet, reward, name, msgs, condition, vars } = options;

      let txBuilder = TxBuilder.new();

      if (!accountRef.current || !configRef.current) {
        return { msgs: [] };
      }

      if (!containsAllReferencedVarsInCosmosMsg(vars, msgs, condition)) {
        throw Error(
          'Unexpected error occurred - unknown variable found in create job transaction payload. Refreshing the page and recreating the job should mitigate the issue.'
        );
      }

      return txBuilder
        .send(accountRef.current.owner, accountRef.current.account, {
          [LUNA.denom]: reward.mul(Big(configRef.current.creation_fee_percentage).add(100).div(100)).toString(),
        })
        .execute<CreateJobMsg>(wallet.walletAddress, contractAddress, {
          create_job: {
            recurring: false,
            requeue_on_evict: true,
            name,
            labels: [],
            description: '',
            condition: condition,
            vars,
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
