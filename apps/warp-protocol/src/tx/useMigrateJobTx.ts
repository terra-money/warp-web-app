import { useTx } from '@terra-money/apps/libs/transactions';
import { TX_KEY } from './txKey';
import { useWarpSdk, useWarpSdkv2 } from '@terra-money/apps/hooks';
import { Job } from 'types';
import { composers, warp_resolver as warp_resolver_v2, Execution } from '@terra-money/warp-sdk-v2';
import { warp_resolver } from '@terra-money/warp-sdk';
import { Coin, Coins } from '@terra-money/feather.js';
import { Token, u } from '@terra-money/apps/types';
import Big from 'big.js';

interface MigrateJobTxProps {
  job: Job;
  durationDays: string;
  fundingAccount?: string;
  amount?: u<Big>;
  token?: Token;
}

const mapVars = (vars: warp_resolver.Variable[]): warp_resolver_v2.Variable[] => {
  return vars.map((v) => {
    if ('static' in v) {
      return {
        static: {
          ...v.static,
          init_fn: {
            string: { simple: v.static.value },
          },
          reinitialize: false,
        },
      } as warp_resolver_v2.Variable;
    }

    return v;
  });
};

const mapExecutions = (job: Job): Execution[] => {
  return [
    {
      msgs: job.info.msgs.map((msg) => ({ generic: msg })),
      condition: job.info.condition,
    },
  ];
};

export const useMigrateJobTx = (waitForCompletion?: boolean) => {
  const sdkv2 = useWarpSdkv2();
  const sdkv1 = useWarpSdk();

  return useTx<MigrateJobTxProps>(
    async (options) => {
      const { wallet, job, durationDays, fundingAccount, token, amount } = options;

      const walletAddress = wallet.walletAddress;

      const vars = mapVars(job.info.vars);

      const executions = mapExecutions(job);

      const estimateJobRewardMsg = composers.job
        .estimate()
        .recurring(job.info.recurring)
        .durationDays(durationDays)
        .vars(vars)
        .executions(executions)
        .compose();

      const nativeTokenDenom = await sdkv2.nativeTokenDenom();

      const rewardEstimate = await sdkv2.estimateJobReward(walletAddress, estimateJobRewardMsg);

      const reward = rewardEstimate.amount.toString();

      const operationalAmountEstimate = await sdkv2.estimateJobFee(
        walletAddress,
        estimateJobRewardMsg,
        rewardEstimate.amount.toString()
      );

      const operationalAmount = operationalAmountEstimate.amount.toString();

      let createJobMsg = composers.job
        .create()
        .name(job.info.name)
        .labels(job.info.labels)
        .reward(reward.toString())
        .fundingAccount(fundingAccount)
        .operationalAmount(operationalAmount.toString())
        .recurring(job.info.recurring)
        .description(`Migrated from v1 jobId: ${job.info.id}`)
        .vars(vars)
        .durationDays(durationDays)
        .executions(executions)
        .compose();

      let coins = new Coins();

      if (token && amount) {
        if (token.type === 'cw20') {
          createJobMsg.cw_funds = [
            {
              cw20: {
                contract_addr: token.token,
                amount: amount.toString(),
              },
            },
          ];
        } else {
          coins = coins.add(new Coin(token.denom, amount.toString()));
        }
      }

      if (!fundingAccount) {
        coins = coins.add(new Coin(nativeTokenDenom, operationalAmount.toString()));
      }

      const createJobV2Tx = await sdkv2.tx.createJob(wallet.walletAddress, createJobMsg, coins);
      const deleteJobV1Tx = await sdkv1.tx.deleteJob(wallet.walletAddress, job.info.id);

      const msgs = [...createJobV2Tx.msgs, ...deleteJobV1Tx.msgs];

      return {
        msgs,
        chainID: sdkv2.chain.config.chainID,
      };
    },
    {
      txKey: TX_KEY.MIGRATE_JOB,
    },
    {
      waitForCompletion,
    }
  );
};