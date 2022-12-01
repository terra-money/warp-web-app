import { useContractAddress } from '@terra-money/apps/hooks';
import { useTx, TxBuilder } from '@terra-money/apps/libs/transactions';
import { LUNA, u } from '@terra-money/apps/types';
import Big from 'big.js';
import { useWarpConfig } from 'queries/useConfigQuery';
import { useWarpAccount } from 'queries/useWarpAccount';
import { useEffect, useRef } from 'react';
import { warp_controller } from '../types/contracts';
import { TX_KEY } from './txKey';

interface EditJobTx {
  name?: string;
  reward?: u<Big>;
  jobId: string;
  condition?: warp_controller.Condition;
}

type ExecuteMsgType = Extract<warp_controller.ExecuteMsg, { update_job: {} }>;

export const useEditJobTx = () => {
  const contractAddress = useContractAddress('warp-controller');

  const { data: account } = useWarpAccount();
  const { data: config } = useWarpConfig();

  const accountRef = useRef<warp_controller.Account | undefined>();
  const configRef = useRef<warp_controller.Config | undefined>();

  useEffect(() => {
    accountRef.current = account;
    configRef.current = config;
  }, [account, config]);

  return useTx<EditJobTx>(
    (options) => {
      const { wallet, jobId, name, reward } = options;

      let txBuilder = TxBuilder.new();
      let rewardMsgPart = reward ? { added_reward: reward.toString() } : {};

      if (!accountRef.current || !configRef.current) {
        return { msgs: [] };
      }

      if (reward) {
        txBuilder = txBuilder.send(accountRef.current.owner, accountRef.current.account, {
          [LUNA.denom]: reward.mul(Big(configRef.current.creation_fee_percentage).add(100).div(100)).toString(),
        });
      }

      return txBuilder
        .execute<ExecuteMsgType>(wallet.walletAddress, contractAddress, {
          update_job: {
            id: jobId,
            name,
            ...rewardMsgPart,
          },
        })
        .build();
    },
    {
      txKey: TX_KEY.EDIT_JOB,
    }
  );
};
