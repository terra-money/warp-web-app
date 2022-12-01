import { Event, EventPK as PK } from '@apps-shared/indexers/services/event-store';

export type WarpControllerActions =
  | 'create_account'
  | 'save_account'
  | 'instantiate'
  | 'create_job'
  | 'delete_job'
  | 'update_job'
  | 'execute_job'
  | 'prioritize_job';

export class WarpPK {
  static controller(action: WarpControllerActions): PK {
    return {
      contract: 'warp-controller',
      action,
    };
  }
}

export interface CreateAccountEvent extends Event {
  contract: 'warp-controller';
  action: 'create_account';
  payload: {
    _contract_address: string;
    action: string;
    dao_address: string;
  };
}

export interface InstantiateEvent extends Event {
  contract: 'warp-controller';
  action: 'instantiate';
  payload: {
    _contract_address: string;
    action: string;
    contract_addr: string;
    owner: string;
    warp_addr: string;
  };
}

export interface SaveAccountEvent extends Event {
  contract: 'warp-controller';
  action: 'save_account';
  payload: {
    _contract_address: string;
    action: string;
    owner: string;
    account_address: string;
  };
}

export interface CreateJobEvent extends Event {
  contract: 'warp-controller';
  action: 'create_job';
  payload: {
    _contract_address: string;
    action: string;
    job_id: string;
    name: string;
    owner: string;
  };
}

export interface DeleteJobEvent extends Event {
  contract: 'warp-controller';
  action: 'delete_job';
  payload: {
    _contract_address: string;
    action: string;
    job_id: string;
  };
}

export interface UpdateJobEvent extends Event {
  contract: 'warp-controller';
  action: 'update_job';
  payload: {
    _contract_address: string;
    action: string;
    job_id: string;
  };
}

export interface ExecuteJobEvent extends Event {
  contract: 'warp-controller';
  action: 'execute_job';
  payload: {
    _contract_address: string;
    action: string;
    job_id: string;
    executor: string;
    job_reward: string;
  };
}

export interface PrioritizeJobEvent extends Event {
  contract: 'warp-controller';
  action: 'prioritize_job';
  payload: {
    _contract_address: string;
    action: string;
    job_id: string;
  };
}

export type WarpControllerJobEvents =
  | CreateJobEvent
  | DeleteJobEvent
  | UpdateJobEvent
  | ExecuteJobEvent
  | PrioritizeJobEvent;

export type WarpControllerEvents = CreateAccountEvent | InstantiateEvent | SaveAccountEvent | WarpControllerJobEvents;

export type WarpEvents = WarpControllerEvents;
