import { FormFunction, FormInput, FormState, useForm } from '@terra-money/apps/hooks';
import { useMemo } from 'react';
import { warp_controller } from 'types';

export interface StaticVariableInput {
  name: string;
  kind: warp_controller.VariableKind;
  value: string;
}

export interface StaticVariableState extends FormState<StaticVariableInput> {
  submitDisabled: boolean;
}

export type StaticVariableFormInput = FormInput<StaticVariableInput>;

export const staticVariableToInput = (variable?: warp_controller.StaticVariable): StaticVariableInput => {
  return {
    name: variable?.name ?? '',
    kind: variable?.kind ?? ('' as warp_controller.VariableKind),
    value: variable?.value ?? '',
  };
};

export const useStaticVariableForm = (variable?: warp_controller.StaticVariable) => {
  const initialValue = useMemo<StaticVariableState>(
    () => ({
      ...staticVariableToInput(variable),
      submitDisabled: true,
    }),
    [variable]
  );

  const form: FormFunction<StaticVariableInput, StaticVariableState> = async (input, getState, dispatch) => {
    const state = {
      ...getState(),
      ...input,
    };

    const nameError = state.name.length > 140 ? 'The name can not exceed the maximum of 140 characters' : undefined;

    const kindError = !state.kind ? 'Variable type is required' : undefined;
    const valueError = !state.value ? 'Value is required' : undefined;

    const submitDisabled = Boolean(
      state.name === undefined || state.name === null || state.name.length < 1 || nameError || kindError || valueError
    );

    dispatch({
      ...state,
      nameError,
      submitDisabled,
    });
  };

  return useForm<StaticVariableInput, StaticVariableState>(form, initialValue);
};
