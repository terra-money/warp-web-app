type TxHistoryEntity = {
  job_id: string;
  timestamp: number;
  txHash: string;
};

export type CreateJobEntity = TxHistoryEntity & {
  type: 'create_job';
  name: string;
  owner: string;
};

export type ExecuteJobEntity = TxHistoryEntity & {
  type: 'execute_job';
};

export type DeleteJobEntity = TxHistoryEntity & {
  type: 'delete_job';
};

export type UpdateJobEntity = TxHistoryEntity & {
  type: 'update_job';
};

export type PrioritizeJobEntity = TxHistoryEntity & {
  type: 'prioritize_job';
};

export type Entity = CreateJobEntity | ExecuteJobEntity | UpdateJobEntity | DeleteJobEntity | PrioritizeJobEntity;
