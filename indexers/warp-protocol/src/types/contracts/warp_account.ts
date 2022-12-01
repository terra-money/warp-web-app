export module warp_account {
  export type Addr = string;
  export interface AccountsResponse {
    accounts: Account[];
  }
  export interface Account {
    account: Addr;
    owner: Addr;
  }
  export interface AccountResponse {
    account: Account;
  }
  export interface Config {
    owner: Addr;
    warp_addr: Addr;
  }
  export type CosmosMsgFor_Empty =
    | {
        bank: BankMsg;
      }
    | {
        custom: Empty;
      }
    | {
        staking: StakingMsg;
      }
    | {
        distribution: DistributionMsg;
      }
    | {
        wasm: WasmMsg;
      };
  export type BankMsg =
    | {
        send: {
          amount: Coin[];
          to_address: string;
        };
      }
    | {
        burn: {
          amount: Coin[];
        };
      };
  export type Uint128 = string;
  export type StakingMsg =
    | {
        delegate: {
          amount: Coin;
          validator: string;
        };
      }
    | {
        undelegate: {
          amount: Coin;
          validator: string;
        };
      }
    | {
        redelegate: {
          amount: Coin;
          dst_validator: string;
          src_validator: string;
        };
      };
  export type DistributionMsg =
    | {
        set_withdraw_address: {
          /**
           * The `withdraw_address`
           */
          address: string;
        };
      }
    | {
        withdraw_delegator_reward: {
          /**
           * The `validator_address`
           */
          validator: string;
        };
      };
  export type WasmMsg =
    | {
        execute: {
          contract_addr: string;
          funds: Coin[];
          /**
           * msg is the json-encoded ExecuteMsg struct (as raw Binary)
           */
          msg: Binary;
        };
      }
    | {
        instantiate: {
          admin?: string | null;
          code_id: number;
          funds: Coin[];
          /**
           * A human-readbale label for the contract
           */
          label: string;
          /**
           * msg is the JSON-encoded InstantiateMsg struct (as raw Binary)
           */
          msg: Binary;
        };
      }
    | {
        migrate: {
          contract_addr: string;
          /**
           * msg is the json-encoded MigrateMsg struct that will be passed to the new code
           */
          msg: Binary;
          /**
           * the code_id of the new logic to place in the given contract
           */
          new_code_id: number;
        };
      }
    | {
        update_admin: {
          admin: string;
          contract_addr: string;
        };
      }
    | {
        clear_admin: {
          contract_addr: string;
        };
      };
  export type Binary = string;
  export interface ExecuteMsg {
    msgs: CosmosMsgFor_Empty[];
  }
  export interface Coin {
    amount: Uint128;
    denom: string;
  }
  export interface Empty {}
  export interface InstantiateMsg {
    owner: string;
  }
  export type Condition =
    | {
        and: Condition[];
      }
    | {
        or: Condition[];
      }
    | {
        not: Condition;
      }
    | {
        expr: Expr;
      };
  export type Expr =
    | {
        string: GenExprFor_ValueFor_StringAnd_StringOp;
      }
    | {
        uint: GenExprFor_ValueFor_Uint256And_NumOp;
      }
    | {
        int: GenExprFor_ValueForInt128And_NumOp;
      }
    | {
        decimal: GenExprFor_ValueFor_Decimal256And_NumOp;
      }
    | {
        timestamp: TimeExpr;
      }
    | {
        block_height: BlockExpr;
      }
    | {
        bool: QueryExpr;
      };
  export type ValueFor_String =
    | {
        simple: string;
      }
    | {
        query: QueryExpr;
      };
  export type StringOp = 'starts_with' | 'ends_with' | 'contains' | 'eq' | 'neq';
  export type ValueFor_Uint256 =
    | {
        simple: Uint256;
      }
    | {
        query: QueryExpr;
      };
  export type Uint256 = string;
  export type NumOp = 'eq' | 'neq' | 'lt' | 'gt' | 'gte' | 'lte';
  export type ValueForInt128 =
    | {
        simple: number;
      }
    | {
        query: QueryExpr;
      };
  export type ValueFor_Decimal256 =
    | {
        simple: Decimal256;
      }
    | {
        query: QueryExpr;
      };
  export type Decimal256 = string;
  export type Uint64 = string;
  export type TimeOp = 'lt' | 'gt';
  export type JobStatus = 'Pending' | 'Executed' | 'Failed' | 'Cancelled';
  export interface JobsResponse {
    jobs: Job[];
  }
  export interface Job {
    condition: Condition;
    id: Uint64;
    last_update_time: Uint64;
    msgs: CosmosMsgFor_Empty[];
    name: string;
    owner: Addr;
    reward: Uint128;
    status: JobStatus;
  }
  export interface GenExprFor_ValueFor_StringAnd_StringOp {
    left: ValueFor_String;
    op: StringOp;
    right: ValueFor_String;
  }
  export interface QueryExpr {
    contract: string;
    name: string;
    query: string;
    selector: string;
  }
  export interface GenExprFor_ValueFor_Uint256And_NumOp {
    left: ValueFor_Uint256;
    op: NumOp;
    right: ValueFor_Uint256;
  }
  export interface GenExprFor_ValueForInt128And_NumOp {
    left: ValueForInt128;
    op: NumOp;
    right: ValueForInt128;
  }
  export interface GenExprFor_ValueFor_Decimal256And_NumOp {
    left: ValueFor_Decimal256;
    op: NumOp;
    right: ValueFor_Decimal256;
  }
  export interface TimeExpr {
    comparator: Uint64;
    op: TimeOp;
  }
  export interface BlockExpr {
    comparator: Uint64;
    op: NumOp;
  }
  export interface JobResponse {
    job: Job;
  }
}
