import { u } from '@terra-money/apps/types';
import { warp_resolver, Job as WarpJob } from '@terra-money/warp-sdk';
import Big from 'big.js';

export class Job {
  info: WarpJob;
  condition: warp_resolver.Condition;
  msgs: warp_resolver.CosmosMsgFor_Empty[];
  vars: warp_resolver.Variable[];
  reward: u<Big>;

  constructor(info: WarpJob) {
    this.info = info;
    this.condition = info.executions[0].condition;
    this.msgs = info.executions[0].msgs;
    this.vars = info.vars;
    this.reward = Big(info.reward) as u<Big>;
  }
}
