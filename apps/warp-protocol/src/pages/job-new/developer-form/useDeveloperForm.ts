import { FormFunction, FormModifier, FormState, LocalWallet, useForm, useLocalWallet } from '@terra-money/apps/hooks';
import { microfy } from '@terra-money/apps/libs/formatting';
import { fetchTokenBalance } from '@terra-money/apps/queries';
import { Token, u } from '@terra-money/apps/types';
import Big from 'big.js';

export interface DeveloperFormInput {
  message: string;
  token?: Token;
  amount?: string;
}

interface DeveloperFormState extends FormState<DeveloperFormInput> {
  submitDisabled: boolean;
  amountValid?: boolean;
  amountError?: string;
  balance: u<Big>;
  balanceLoading: boolean;
}

const dispatchTokenBalance = (
  token: Token | undefined,
  localWallet: LocalWallet,
  dispatch: FormModifier<DeveloperFormState>
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

const initialValue: DeveloperFormState = {
  message: '',
  submitDisabled: true,
  token: undefined,
  balance: Big(0) as u<Big>,
  balanceLoading: false,
  amount: '',
};

export const useDeveloperForm = () => {
  const wallet = useLocalWallet();

  const form: FormFunction<DeveloperFormInput, DeveloperFormState> = async (input, getState, dispatch) => {
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

    const uAmount = state.token && state.amount ? microfy(state.amount, state.token.decimals) : Big(0);

    const amountError = uAmount.gt(state.balance) ? 'The amount can not exceed the maximum balance' : undefined;

    const amountValid = uAmount.gt(0) && amountError === undefined;

    let messageError = undefined;

    if (state.message) {
      try {
        JSON.parse(state.message);
      } catch (err) {
        messageError = 'Message format invalid.';
      }
    }

    const messageValid = Boolean(state.message) && messageError === undefined;

    const submitDisabled =
      Boolean(state.token && amountValid === false) ||
      Boolean(state.message === undefined || messageError || !messageValid);

    dispatch({
      ...state,
      amountError,
      amountValid,
      messageValid,
      messageError,
      submitDisabled,
    });
  };

  return useForm<DeveloperFormInput, DeveloperFormState>(form, initialValue, async (state, dispatch) => {
    if (wallet.connectedWallet === undefined) {
      throw Error('The wallet is not connected');
    }

    if (state.token) {
      dispatchTokenBalance(state.token, wallet, dispatch);
    }
  });
};
