import { FormFunction, FormState, useForm } from '@terra-money/apps/hooks';
import { useMemo } from 'react';

export interface DeveloperFormInput {
  message: string;
}

interface DeveloperFormState extends FormState<DeveloperFormInput> {
  submitDisabled: boolean;
}

export const useDeveloperForm = () => {
  const initialValue = useMemo<DeveloperFormState>(
    () => ({
      message: '',
      submitDisabled: true,
    }),
    []
  );

  const form: FormFunction<DeveloperFormInput, DeveloperFormState> = async (input, getState, dispatch) => {
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

    const messageValid = Boolean(state.message) && messageError === undefined;

    const submitDisabled = Boolean(state.message === undefined || messageError || !messageValid);

    dispatch({
      ...state,
      messageValid,
      messageError,
      submitDisabled,
    });
  };

  return useForm<DeveloperFormInput, DeveloperFormState>(form, initialValue);
};
