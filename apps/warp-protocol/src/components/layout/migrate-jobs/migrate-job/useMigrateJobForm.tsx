import { FormFunction, FormState, useForm } from '@terra-money/apps/hooks';
import { useMemo } from 'react';
import { warp_controller } from '@terra-money/warp-sdk-v2';

export interface MigrateJobFormInput {
  durationDays: string;
  fundingAccount?: string;
  cwFunds?: warp_controller.CwFund[];
  nativeFunds?: warp_controller.Coin[];
}

interface MigrateJobFormState extends FormState<MigrateJobFormInput> {
  submitDisabled: boolean;
}

export const useMigrateJobForm = (input?: MigrateJobFormInput) => {
  const initialValue = useMemo<MigrateJobFormState>(
    () => ({
      durationDays: input?.durationDays ?? '',
      submitDisabled: input ? false : true,
    }),
    [input]
  );

  const form: FormFunction<MigrateJobFormInput, MigrateJobFormState> = async (input, getState, dispatch) => {
    const state = {
      ...getState(),
      ...input,
    };

    const submitDisabled = Boolean(
      state.durationDays === undefined || state.durationDays === null || state.durationDays.length < 1
    );

    dispatch({
      ...state,
      submitDisabled,
    });
  };

  return useForm<MigrateJobFormInput, MigrateJobFormState>(form, initialValue);
};
