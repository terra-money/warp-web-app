import { FormFunction, FormModifier, FormState, LocalWallet, useForm, useLocalWallet } from '@terra-money/apps/hooks';
import { warp_controller } from '@terra-money/warp-sdk-v2';
import { Token, u } from '@terra-money/apps/types';
import Big from 'big.js';
import { microfy } from '@terra-money/apps/libs/formatting';
import { fetchTokenBalance } from '@terra-money/apps/queries';

export interface MigrateJobFormInput {
  durationDays: string;
  fundingAccount?: string;
  cwFunds?: warp_controller.CwFund[];
  nativeFunds?: warp_controller.Coin[];
  token?: Token;
  amount?: string;
}

interface MigrateJobFormState extends FormState<MigrateJobFormInput> {
  submitDisabled: boolean;
  amountValid?: boolean;
  amountError?: string;
  balance: u<Big>;
  balanceLoading: boolean;
}

const dispatchTokenBalance = (
  token: Token | undefined,
  localWallet: LocalWallet,
  dispatch: FormModifier<MigrateJobFormState>
) => {
  dispatch({
    amount: '',
    balance: Big(0) as u<Big>,
    balanceLoading: true,
  });

  fetchTokenBalance(localWallet.lcd, token, localWallet.walletAddress)
    .then((balance) => {
      dispatch({
        balance,
        balanceLoading: false,
      });
    })
    .catch(() => {
      dispatch({
        balance: Big(0) as u<Big>,
        balanceLoading: false,
      });
    });
};

const initialValue: MigrateJobFormState = {
  durationDays: '',
  fundingAccount: undefined,
  submitDisabled: true,
  token: undefined,
  balance: Big(0) as u<Big>,
  balanceLoading: false,
  amount: '',
};

export const useMigrateJobForm = () => {
  const wallet = useLocalWallet();

  const form: FormFunction<MigrateJobFormInput, MigrateJobFormState> = async (input, getState, dispatch) => {
    if (wallet.connectedWallet === undefined) {
      throw Error('The wallet is not connected');
    }

    if ('token' in input) {
      dispatchTokenBalance(input.token, wallet, dispatch);
    }

    const state = {
      ...getState(),
      ...input,
    };

    const uAmount = state.token && input.amount ? microfy(input.amount, state.token.decimals) : Big(0);

    const amountError = uAmount.gt(state.balance) ? 'The amount can not exceed the maximum balance' : undefined;

    const amountValid = uAmount.gt(0) && amountError === undefined;

    const submitDisabled =
      Boolean(state.token && amountValid === false) ||
      state.durationDays === undefined ||
      state.durationDays === null ||
      state.durationDays.length < 1;

    dispatch({
      ...state,
      amountError,
      amountValid,
      submitDisabled,
    });
  };

  return useForm<MigrateJobFormInput, MigrateJobFormState>(form, initialValue, async (state, dispatch) => {
    if (wallet.connectedWallet === undefined) {
      throw Error('The wallet is not connected');
    }

    if (state.token) {
      dispatchTokenBalance(state.token, wallet, dispatch);
    }
  });
};
