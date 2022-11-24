import { FormFunction, FormInitializer, FormModifier, useForm } from 'shared/hooks';
import { microfy } from 'shared/libs/formatting';
import { fetchTokenBalance } from 'shared/queries';
import { LUNA, Token, u } from 'shared/types';
import { ConnectedWallet, useConnectedWallet } from '@terra-money/wallet-provider';
import Big from 'big.js';
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

const dispatchBalance = async (
  dispatch: FormModifier<EditJobState>,
  connectedWallet: ConnectedWallet,
  token: Token
) => {
  dispatch({
    reward: '',
    balance: Big(0) as u<Big>,
    balanceLoading: true,
  });

  const { network, walletAddress } = connectedWallet;

  try {
    const balance = await fetchTokenBalance(network, token, walletAddress);

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

  const connectedWallet = useConnectedWallet();

  const initializer: FormInitializer<EditJobState> = async (_, dispatch) => {
    if (connectedWallet === undefined) {
      throw Error('The wallet is not connected');
    }

    dispatchBalance(dispatch, connectedWallet, LUNA);
  };

  const form: FormFunction<EditJobInput, EditJobState> = async (input, getState, dispatch) => {
    const state = {
      ...getState(),
      ...input,
    };

    const nameError = state.name.length > 140 ? 'The name can not exceed the maximum of 140 characters' : undefined;

    const uReward = input.reward ? microfy(input.reward, LUNA.decimals) : Big(0);

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
