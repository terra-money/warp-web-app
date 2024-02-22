import { Token } from '@terra-money/apps/types';
import { FormModifier, LocalWallet, useForm, useLocalWallet } from '@terra-money/apps/hooks';
import Big from 'big.js';
import { u } from '@terra-money/apps/types';
import { microfy } from '@terra-money/apps/libs/formatting';
import { fetchTokenBalance } from '@terra-money/apps/queries';

interface MigrateFundsInput {
  token?: Token;
  amount?: string;
}

interface MigrateFundsState extends MigrateFundsInput {
  token?: Token;
  amountValid?: boolean;
  amountError?: string;
  balance: u<Big>;
  balanceLoading: boolean;
  submitDisabled: boolean;
}

const initialState: MigrateFundsState = {
  token: undefined,
  balance: Big(0) as u<Big>,
  balanceLoading: false,
  amount: '',
  submitDisabled: true,
};

const dispatchTokenBalance = (
  token: Token | undefined,
  localWallet: LocalWallet,
  dispatch: FormModifier<MigrateFundsState>,
  account: string
) => {
  dispatch({
    amount: '',
    balance: Big(0) as u<Big>,
    balanceLoading: true,
  });

  fetchTokenBalance(localWallet.lcd, token, account)
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

export const useMigrateFundsForm = (selectedToken: Token, account: string) => {
  const wallet = useLocalWallet();

  return useForm<MigrateFundsInput, MigrateFundsState>(
    async (input, getState, dispatch) => {
      if (wallet.connectedWallet === undefined) {
        throw Error('The wallet is not connected');
      }

      if ('token' in input) {
        dispatchTokenBalance(input.token, wallet, dispatch, account);
      }

      const state = {
        ...getState(),
        ...input,
      };

      const uAmount = state.token && input.amount ? microfy(input.amount, state.token.decimals) : Big(0);

      const amountError = uAmount.gt(state.balance) ? 'The amount can not exceed the maximum balance' : undefined;

      const amountValid = uAmount.gt(0) && amountError === undefined;

      const submitDisabled = Boolean(state.token === undefined || amountValid === false);

      dispatch({
        ...state,
        amountError,
        amountValid,
        submitDisabled,
      });
    },
    { ...initialState, token: selectedToken },
    async (state, dispatch) => {
      if (wallet.connectedWallet === undefined) {
        throw Error('The wallet is not connected');
      }

      if (state.token) {
        dispatchTokenBalance(state.token, wallet, dispatch, account);
      }
    }
  );
};
