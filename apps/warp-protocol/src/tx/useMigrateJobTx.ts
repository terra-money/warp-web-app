import { useTx } from '@terra-money/apps/libs/transactions';
import { TX_KEY } from './txKey';
import { useWarpSdkv2 } from '@terra-money/apps/hooks';
import { Job } from 'types';
import { composers, warp_resolver as warp_resolver_v2, Execution } from '@terra-money/warp-sdk-v2';
import { warp_resolver } from '@terra-money/warp-sdk';
import { Coin } from '@terra-money/feather.js';

interface MigrateJobTxProps {
  job: Job;
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

export const useMigrateJobTx = () => {
  const sdk = useWarpSdkv2();

  return useTx<MigrateJobTxProps>(
    async (options) => {
      const { wallet, job } = options;

      const walletAddress = wallet.walletAddress;

      const durationDays = '30';

      const vars = mapVars(job.info.vars);

      const executions = mapExecutions(job);

      const estimateJobRewardMsg = composers.job
        .estimate()
        .recurring(job.info.recurring)
        .durationDays(durationDays)
        .vars(vars)
        .executions(executions)
        .compose();

      const nativeTokenDenom = await sdk.nativeTokenDenom();

      const rewardEstimate = await sdk.estimateJobReward(walletAddress, estimateJobRewardMsg);

      const reward = rewardEstimate.amount.toString();

      const operationalAmountEstimate = await sdk.estimateJobFee(
        walletAddress,
        estimateJobRewardMsg,
        rewardEstimate.amount.toString()
      );

      const operationalAmount = operationalAmountEstimate.amount.toString();

      const createJobMsg = composers.job
        .create()
        .name(job.info.name)
        .labels(job.info.labels)
        .reward(reward.toString())
        .operationalAmount(operationalAmount.toString())
        .recurring(job.info.recurring)
        .description(job.info.description)
        .vars(vars)
        .durationDays(durationDays)
        .executions(executions)
        .compose();

      return sdk.tx.createJob(wallet.walletAddress, createJobMsg, [new Coin(nativeTokenDenom, operationalAmount)]);
    },
    {
      txKey: TX_KEY.MIGRATE_JOB,
    }
  );
};
