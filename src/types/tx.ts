export type IncreaseAllowanceMsg = {
  increase_allowance: {
    spender: string;
    amount: string;
  };
};

export type HookMsg = {
  send: {
    amount: string;
    contract: string;
    msg: string;
  };
};

export type TransferMsg = {
  transfer: {
    recipient: string;
    amount: string;
  };
};
