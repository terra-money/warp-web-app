import { Token } from 'types';
import { useForm } from 'shared/hooks';
import Big from 'big.js';
import { u } from 'shared/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { microfy } from 'shared/libs/formatting';

interface AddFundsInput {
  amount?: string;
}

interface AddFundsState extends AddFundsInput {
  amountValid?: boolean;
  amountError?: string;
  submitDisabled: boolean;
}

const initialState: AddFundsState = {
  amount: '',
  submitDisabled: true,
};

export const useWithdrawFundsForm = (token: Token, balance: u<Big>) => {
  const connectedWallet = useConnectedWallet();

  return useForm<AddFundsInput, AddFundsState>(async (input, getState, dispatch) => {
    if (connectedWallet === undefined) {
      throw Error('The wallet is not connected');
    }

    const state = {
      ...getState(),
      ...input,
    };

    const uAmount = input.amount ? microfy(input.amount, token.decimals) : Big(0);

    const amountError = uAmount.gt(balance) ? 'The amount can not exceed the maximum balance' : undefined;

    const amountValid = uAmount.gt(0) && amountError === undefined;

    const submitDisabled = Boolean(amountValid === false);

    dispatch({
      ...state,
      amountError,
      amountValid,
      submitDisabled,
    });
  }, initialState);
};
