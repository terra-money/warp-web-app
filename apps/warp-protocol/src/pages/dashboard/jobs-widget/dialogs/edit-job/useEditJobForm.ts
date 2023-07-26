import {
  FormFunction,
  FormInitializer,
  FormModifier,
  LocalWallet,
  useForm,
  useLocalWallet,
} from '@terra-money/apps/hooks';
import { microfy } from '@terra-money/apps/libs/formatting';
import { fetchTokenBalance } from '@terra-money/apps/queries';
import { Token, u } from '@terra-money/apps/types';
import Big from 'big.js';
import { useNativeToken } from 'hooks/useNativeToken';
import { useMemo } from 'react';
import { Job } from 'types/job';

interface EditJobInput {
  name: string;
  reward: string;
}

interface EditJobState extends EditJobInput {
  nameError?: string;
  rewardError?: string;
  nameValid?: boolean;
  rewardValid?: boolean;
  submitDisabled: boolean;
  balance: u<Big>;
  balanceLoading: boolean;
}

const dispatchBalance = async (dispatch: FormModifier<EditJobState>, localWallet: LocalWallet, token: Token) => {
  dispatch({
    reward: '',
    balance: Big(0) as u<Big>,
    balanceLoading: true,
  });

  try {
    const balance = await fetchTokenBalance(localWallet.lcd, token, localWallet.walletAddress);

    dispatch({
      reward: '',
      balance: balance as u<Big>,
      balanceLoading: false,
    });
  } catch {
    dispatch({
      reward: '',
      balance: Big(0) as u<Big>,
      balanceLoading: false,
    });
  }
};

export const useEditJobForm = (job: Job) => {
  const initialValue = useMemo<EditJobState>(
    () => ({
      name: job.info.name,
      reward: job.info.reward,
      submitDisabled: true,
      balance: Big(0) as u<Big>,
      balanceLoading: false,
    }),
    [job]
  );

  const wallet = useLocalWallet();

  const nativeToken = useNativeToken();

  const initializer: FormInitializer<EditJobState> = async (_, dispatch) => {
    if (wallet.connectedWallet === undefined) {
      throw Error('The wallet is not connected');
    }

    dispatchBalance(dispatch, wallet, nativeToken);
  };

  const form: FormFunction<EditJobInput, EditJobState> = async (input, getState, dispatch) => {
    const state = {
      ...getState(),
      ...input,
    };

    const nameError = state.name.length > 140 ? 'The name can not exceed the maximum of 140 characters' : undefined;

    const uReward = input.reward ? microfy(input.reward, nativeToken.decimals) : Big(0);

    const rewardError = uReward.gt(state.balance) ? 'The amount can not exceed the maximum balance' : undefined;

    const rewardValid = uReward.gt(0) && rewardError === undefined;

    const submitDisabled = Boolean(
      state.name === undefined || state.name === null || state.name.length < 1 || nameError
    );

    dispatch({
      ...state,
      nameError,
      rewardError,
      rewardValid,
      submitDisabled,
    });
  };

  return useForm<EditJobInput, EditJobState>(form, initialValue, initializer);
};
