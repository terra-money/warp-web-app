export module warp_controller {
  export type Addr = string;
  export interface AccountResponse {
    account: Account;
  }
  export interface Account {
    account: Addr;
    owner: Addr;
  }
  export interface AccountsResponse {
    accounts: Account[];
  }
  export type Uint128 = string;
  export type Uint64 = string;
  export interface Config {
    cancellation_fee_percentage: Uint128;
    creation_fee_percentage: Uint128;
    minimum_reward: Uint128;
    owner: Addr;
    warp_account_code_id: Uint64;
  }
  export interface ConfigResponse {
    config: Config;
  }
  export type ExecuteMsg =
    | {
        create_job: CreateJobMsg;
      }
    | {
        delete_job: DeleteJobMsg;
      }
    | {
        update_job: UpdateJobMsg;
      }
    | {
        execute_job: ExecuteJobMsg;
      }
    | {
        create_account: CreateAccountMsg;
      }
    | {
        update_config: UpdateConfigMsg;
      }
    | {
        submit_template: SubmitTemplateMsg;
      }
    | {
        edit_template: EditTemplateMsg;
      }
    | {
        delete_template: DeleteTemplateMsg;
      };
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
        uint: GenExprFor_NumValueFor_Uint256And_NumExprOpAnd_IntFnOpAnd_NumOp;
      }
    | {
        int: GenExprFor_NumValueForInt128And_NumExprOpAnd_IntFnOpAnd_NumOp;
      }
    | {
        decimal: GenExprFor_NumValueFor_Decimal256And_NumExprOpAnd_DecimalFnOpAnd_NumOp;
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
  export type QueryRequestFor_String =
    | {
        bank: BankQuery;
      }
    | {
        custom: string;
      }
    | {
        staking: StakingQuery;
      }
    | {
        stargate: {
          /**
           * this is the expected protobuf message type (not any), binary encoded
           */
          data: Binary;
          /**
           * this is the fully qualified service path used for routing, eg. custom/cosmos_sdk.x.bank.v1.Query/QueryBalance
           */
          path: string;
        };
      }
    | {
        ibc: IbcQuery;
      }
    | {
        wasm: WasmQuery;
      };
  export type BankQuery =
    | {
        balance: {
          address: string;
          denom: string;
        };
      }
    | {
        all_balances: {
          address: string;
        };
      };
  export type StakingQuery =
    | {
        bonded_denom: {};
      }
    | {
        all_delegations: {
          delegator: string;
        };
      }
    | {
        delegation: {
          delegator: string;
          validator: string;
        };
      }
    | {
        all_validators: {};
      }
    | {
        validator: {
          /**
           * The validator's address (e.g. (e.g. cosmosvaloper1...))
           */
          address: string;
        };
      };
  export type Binary = string;
  export type IbcQuery =
    | {
        port_id: {};
      }
    | {
        list_channels: {
          port_id?: string | null;
        };
      }
    | {
        channel: {
          channel_id: string;
          port_id?: string | null;
        };
      };
  export type WasmQuery =
    | {
        smart: {
          contract_addr: string;
          /**
           * msg is the json-encoded QueryMsg struct
           */
          msg: Binary;
        };
      }
    | {
        raw: {
          contract_addr: string;
          /**
           * Key is the raw key used in the contracts Storage
           */
          key: Binary;
        };
      }
    | {
        contract_info: {
          contract_addr: string;
        };
      };
  export type StringOp = 'starts_with' | 'ends_with' | 'contains' | 'eq' | 'neq';
  export type NumValueFor_Uint256And_NumExprOpAnd_IntFnOp =
    | {
        simple: Uint256;
      }
    | {
        expr: NumExprValueFor_Uint256And_NumExprOpAnd_IntFnOp;
      }
    | {
        query: QueryExpr;
      }
    | {
        fn: NumFnValueFor_Uint256And_NumExprOpAnd_IntFnOp;
      };
  export type Uint256 = string;
  export type NumExprOp = 'add' | 'sub' | 'div' | 'mul' | 'mod';
  export type IntFnOp = 'abs' | 'neg';
  export type NumOp = 'eq' | 'neq' | 'lt' | 'gt' | 'gte' | 'lte';
  export type NumValueForInt128And_NumExprOpAnd_IntFnOp =
    | {
        simple: number;
      }
    | {
        expr: NumExprValueForInt128And_NumExprOpAnd_IntFnOp;
      }
    | {
        query: QueryExpr;
      }
    | {
        fn: NumFnValueForInt128And_NumExprOpAnd_IntFnOp;
      };
  export type NumValueFor_Decimal256And_NumExprOpAnd_DecimalFnOp =
    | {
        simple: Decimal256;
      }
    | {
        expr: NumExprValueFor_Decimal256And_NumExprOpAnd_DecimalFnOp;
      }
    | {
        query: QueryExpr;
      }
    | {
        fn: NumFnValueFor_Decimal256And_NumExprOpAnd_DecimalFnOp;
      };
  export type Decimal256 = string;
  export type DecimalFnOp = 'abs' | 'neg' | 'floor' | 'sqrt' | 'ceil';
  export type TimeOp = 'lt' | 'gt';
  export type TemplateKind = 'query' | 'msg';
  export type TemplateVarKind = 'string' | 'uint' | 'int' | 'decimal' | 'bool' | 'amount' | 'asset' | 'timestamp';
  export interface CreateJobMsg {
    condition: Condition;
    msgs: string[];
    name: string;
    reward: Uint128;
  }
  export interface GenExprFor_ValueFor_StringAnd_StringOp {
    left: ValueFor_String;
    op: StringOp;
    right: ValueFor_String;
  }
  export interface QueryExpr {
    name: string;
    query: QueryRequestFor_String;
    selector: string;
  }
  export interface GenExprFor_NumValueFor_Uint256And_NumExprOpAnd_IntFnOpAnd_NumOp {
    left: NumValueFor_Uint256And_NumExprOpAnd_IntFnOp;
    op: NumOp;
    right: NumValueFor_Uint256And_NumExprOpAnd_IntFnOp;
  }
  export interface NumExprValueFor_Uint256And_NumExprOpAnd_IntFnOp {
    left: NumValueFor_Uint256And_NumExprOpAnd_IntFnOp;
    op: NumExprOp;
    right: NumValueFor_Uint256And_NumExprOpAnd_IntFnOp;
  }
  export interface NumFnValueFor_Uint256And_NumExprOpAnd_IntFnOp {
    op: IntFnOp;
    right: NumValueFor_Uint256And_NumExprOpAnd_IntFnOp;
  }
  export interface GenExprFor_NumValueForInt128And_NumExprOpAnd_IntFnOpAnd_NumOp {
    left: NumValueForInt128And_NumExprOpAnd_IntFnOp;
    op: NumOp;
    right: NumValueForInt128And_NumExprOpAnd_IntFnOp;
  }
  export interface NumExprValueForInt128And_NumExprOpAnd_IntFnOp {
    left: NumValueForInt128And_NumExprOpAnd_IntFnOp;
    op: NumExprOp;
    right: NumValueForInt128And_NumExprOpAnd_IntFnOp;
  }
  export interface NumFnValueForInt128And_NumExprOpAnd_IntFnOp {
    op: IntFnOp;
    right: NumValueForInt128And_NumExprOpAnd_IntFnOp;
  }
  export interface GenExprFor_NumValueFor_Decimal256And_NumExprOpAnd_DecimalFnOpAnd_NumOp {
    left: NumValueFor_Decimal256And_NumExprOpAnd_DecimalFnOp;
    op: NumOp;
    right: NumValueFor_Decimal256And_NumExprOpAnd_DecimalFnOp;
  }
  export interface NumExprValueFor_Decimal256And_NumExprOpAnd_DecimalFnOp {
    left: NumValueFor_Decimal256And_NumExprOpAnd_DecimalFnOp;
    op: NumExprOp;
    right: NumValueFor_Decimal256And_NumExprOpAnd_DecimalFnOp;
  }
  export interface NumFnValueFor_Decimal256And_NumExprOpAnd_DecimalFnOp {
    op: DecimalFnOp;
    right: NumValueFor_Decimal256And_NumExprOpAnd_DecimalFnOp;
  }
  export interface TimeExpr {
    comparator: Uint64;
    op: TimeOp;
  }
  export interface BlockExpr {
    comparator: Uint64;
    op: NumOp;
  }
  export interface DeleteJobMsg {
    id: Uint64;
  }
  export interface UpdateJobMsg {
    added_reward?: Uint128 | null;
    condition?: Condition | null;
    id: Uint64;
    name?: string | null;
  }
  export interface ExecuteJobMsg {
    id: Uint64;
  }
  export interface CreateAccountMsg {}
  export interface UpdateConfigMsg {
    cancellation_fee_percentage?: Uint128 | null;
    creation_fee_percentage?: Uint128 | null;
    minimum_reward?: Uint128 | null;
    owner?: string | null;
  }
  export interface SubmitTemplateMsg {
    formatted_str: string;
    kind: TemplateKind;
    msg: string;
    name: string;
    vars: TemplateVar[];
  }
  export interface TemplateVar {
    kind: TemplateVarKind;
    name: string;
    path: string;
  }
  export interface EditTemplateMsg {
    formatted_str?: string | null;
    id: Uint64;
    msg?: string | null;
    name?: string | null;
    vars?: TemplateVar[] | null;
  }
  export interface DeleteTemplateMsg {
    id: Uint64;
  }
  export interface InstantiateMsg {
    cancellation_fee: Uint128;
    creation_fee: Uint128;
    minimum_reward: Uint128;
    owner?: string | null;
    warp_account_code_id: Uint64;
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
        stargate: {
          type_url: string;
          value: Binary;
        };
      }
    | {
        ibc: IbcMsg;
      }
    | {
        wasm: WasmMsg;
      }
    | {
        gov: GovMsg;
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
  export type IbcMsg =
    | {
        transfer: {
          /**
           * packet data only supports one coin https://github.com/cosmos/cosmos-sdk/blob/v0.40.0/proto/ibc/applications/transfer/v1/transfer.proto#L11-L20
           */
          amount: Coin;
          /**
           * exisiting channel to send the tokens over
           */
          channel_id: string;
          /**
           * when packet times out, measured on remote chain
           */
          timeout: IbcTimeout;
          /**
           * address on the remote chain to receive these tokens
           */
          to_address: string;
        };
      }
    | {
        send_packet: {
          channel_id: string;
          data: Binary;
          /**
           * when packet times out, measured on remote chain
           */
          timeout: IbcTimeout;
        };
      }
    | {
        close_channel: {
          channel_id: string;
        };
      };
  export type Timestamp = Uint64;
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
  export type GovMsg = {
    vote: {
      proposal_id: number;
      vote: VoteOption;
    };
  };
  export type VoteOption = 'yes' | 'no' | 'abstain' | 'no_with_veto';
  export type JobStatus = 'Pending' | 'Executed' | 'Failed' | 'Cancelled';
  export interface JobResponse {
    job: Job;
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
  export interface Coin {
    amount: Uint128;
    denom: string;
  }
  export interface Empty {}
  export interface IbcTimeout {
    block?: IbcTimeoutBlock | null;
    timestamp?: Timestamp | null;
  }
  export interface IbcTimeoutBlock {
    /**
     * block height after which the packet times out. the height within the given revision
     */
    height: number;
    /**
     * the version that the client is currently on (eg. after reseting the chain this could increment 1 as height drops to 0)
     */
    revision: number;
  }
  export interface JobsResponse {
    jobs: Job[];
    total_count: number;
  }
  export type QueryMsg =
    | {
        query_job: QueryJobMsg;
      }
    | {
        query_jobs: QueryJobsMsg;
      }
    | {
        query_resolve_job_condition: QueryResolveJobConditionMsg;
      }
    | {
        query_resolve_condition: QueryResolveConditionMsg;
      }
    | {
        simulate_query: SimulateQueryMsg;
      }
    | {
        query_account: QueryAccountMsg;
      }
    | {
        query_accounts: QueryAccountsMsg;
      }
    | {
        query_config: QueryConfigMsg;
      }
    | {
        query_template: QueryTemplateMsg;
      }
    | {
        query_templates: QueryTemplatesMsg;
      };
  export interface QueryJobMsg {
    id: Uint64;
  }
  export interface QueryJobsMsg {
    active?: boolean | null;
    condition_status?: boolean | null;
    ids?: Uint64[] | null;
    job_status?: JobStatus | null;
    limit?: number | null;
    name?: string | null;
    owner?: Addr | null;
    start_after?: JobIndex | null;
  }
  export interface JobIndex {
    _0: Uint128;
    _1: Uint64;
  }
  export interface QueryResolveJobConditionMsg {
    id: Uint64;
  }
  export interface QueryResolveConditionMsg {
    condition: Condition;
  }
  export interface SimulateQueryMsg {
    query: QueryRequestFor_String;
  }
  export interface QueryAccountMsg {
    owner: string;
  }
  export interface QueryAccountsMsg {
    limit?: number | null;
    start_after?: string | null;
  }
  export interface QueryConfigMsg {}
  export interface QueryTemplateMsg {
    id: Uint64;
  }
  export interface QueryTemplatesMsg {
    ids?: Uint64[] | null;
    kind?: TemplateKind | null;
    limit?: number | null;
    name?: string | null;
    owner?: Addr | null;
    start_after?: Uint64 | null;
  }
  export interface SimulateResponse {
    response: string;
  }
  export interface Template {
    formatted_str: string;
    id: Uint64;
    kind: TemplateKind;
    msg: string;
    name: string;
    owner: Addr;
    vars: TemplateVar[];
  }
  export interface TemplateResponse {
    template: Template;
  }
  export interface TemplatesResponse {
    templates: Template[];
  }
}
