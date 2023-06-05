import { FormFunction, FormInitializer, FormModifier, FormState, useForm } from '@terra-money/apps/hooks';
import { microfy } from '@terra-money/apps/libs/formatting';
import { fetchTokenBalance } from '@terra-money/apps/queries';
import { LUNA, Token, u } from '@terra-money/apps/types';
import { ConnectedWallet, useConnectedWallet } from '@terra-money/wallet-provider';
import Big from 'big.js';
import { useMemo } from 'react';
import { isEmpty } from 'lodash';
import { warp_controller } from 'types';
import { templateVariables } from 'utils/variable';

export interface DetailsFormInput {
  name: string;
  description: string;
  reward: string;
  message: string;
  template?: warp_controller.Template;
  selectedTabType?: 'template' | 'message';
}

interface DetailsFormState extends FormState<DetailsFormInput> {
  submitDisabled: boolean;
  tokenBalance: u<Big>;
  tokenBalanceLoading: boolean;
  nativeBalance: u<Big>;
  nativeBalanceLoading: boolean;
}

const dispatchBalance = async (
  dispatch: FormModifier<DetailsFormState>,
  connectedWallet: ConnectedWallet,
  token: Token,
  prefix: string
) => {
  dispatch({
    [`${prefix}Balance`]: Big(0) as u<Big>,
    [`${prefix}BalanceLoading`]: true,
  });

  const { network, walletAddress } = connectedWallet;

  try {
    const balance = await fetchTokenBalance(network, token, walletAddress);

    dispatch({
      [`${prefix}Balance`]: balance as u<Big>,
      [`${prefix}BalanceLoading`]: false,
    });
  } catch {
    dispatch({
      [`${prefix}Balance`]: Big(0) as u<Big>,
      [`${prefix}BalanceLoading`]: true,
    });
  }
};

export const useDetailsForm = (input?: DetailsFormInput) => {
  const initialValue = useMemo<DetailsFormState>(
    () => ({
      name: input?.name ?? '',
      reward: input?.reward ?? '',
      message: input?.message ?? '',
      description: input?.description ?? '',
      template: input?.template ?? undefined,
      selectedTabType: input?.selectedTabType ?? 'template',
      submitDisabled: input ? false : true,
      tokenBalance: Big(0) as u<Big>,
      tokenBalanceLoading: false,
      nativeBalance: Big(0) as u<Big>,
      nativeBalanceLoading: false,
    }),
    [input]
  );

  const connectedWallet = useConnectedWallet();

  const initializer: FormInitializer<DetailsFormState> = async (_, dispatch) => {
    if (connectedWallet === undefined) {
      throw Error('The wallet is not connected');
    }

    dispatchBalance(dispatch, connectedWallet, LUNA, 'native');
    dispatchBalance(dispatch, connectedWallet, LUNA, 'token');
  };

  const form: FormFunction<DetailsFormInput, DetailsFormState> = async (input, getState, dispatch) => {
    const state = {
      ...getState(),
      ...input,
    };

    let messageError = undefined;

    if (state.message) {
      try {
        JSON.parse(state.message);
      } catch (err) {
        messageError = 'Message format invalid.';
      }
    }

    const nameError = state.name.length > 140 ? 'The name can not exceed the maximum of 140 characters' : undefined;

    const descriptionError =
      state.description.length > 200 ? 'The description can not exceed the maximum of 200 characters' : undefined;

    const uReward = state.reward ? microfy(state.reward, LUNA.decimals) : Big(0);

    const rewardError = uReward.gt(state.tokenBalance) ? 'The amount can not exceed the maximum balance' : undefined;

    const rewardValid = uReward.gt(0) && rewardError === undefined;

    const messageValid = Boolean(state.message) && messageError === undefined;

    const templateError = Boolean(state.template && templateVariables(state.template).find((v) => isEmpty(v.value)))
      ? 'All variables must be filled.'
      : undefined;

    const submitDisabled = Boolean(
      state.name === undefined ||
        state.name === null ||
        state.name.length < 1 ||
        nameError ||
        descriptionError ||
        state.message === undefined ||
        messageError ||
        rewardError ||
        !rewardValid ||
        !messageValid ||
        templateError
    );

    dispatch({
      ...state,
      rewardValid,
      rewardError,
      nameError,
      messageValid,
      messageError,
      descriptionError,
      templateError,
      submitDisabled,
    });
  };

  return useForm<DetailsFormInput, DetailsFormState>(form, initialValue, initializer);
};
