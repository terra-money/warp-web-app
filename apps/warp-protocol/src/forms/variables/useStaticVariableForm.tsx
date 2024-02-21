import { FormFunction, FormInput, FormState, useForm } from '@terra-money/apps/hooks';
import { useMemo } from 'react';
import { warp_resolver } from '@terra-money/warp-sdk';

export interface StaticVariableInput {
  name: string;
  kind: warp_resolver.VariableKind;
  value: string;
  onSuccess?: warp_resolver.FnValue;
  onError?: warp_resolver.FnValue;
  encode: boolean;
}

export interface StaticVariableState extends FormState<StaticVariableInput> {
  submitDisabled: boolean;
}

export type StaticVariableFormInput = FormInput<StaticVariableInput>;

export const staticVariableToInput = (variable?: warp_resolver.StaticVariable): StaticVariableInput => {
  return {
    name: variable?.name ?? '',
    kind: variable?.kind ?? ('' as warp_resolver.VariableKind),
    value: variable?.value ?? '',
    onSuccess: variable?.update_fn?.on_success ?? undefined,
    onError: variable?.update_fn?.on_error ?? undefined,
    encode: variable?.encode ?? false,
  };
};

export const useStaticVariableForm = (variable?: warp_resolver.StaticVariable) => {
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

    const isNumKind = ['decimal', 'uint', 'int'].includes(state.kind);

    const onSuccess = isNumKind ? state.onSuccess : undefined;
    const onError = isNumKind ? state.onError : undefined;

    dispatch({
      ...state,
      onSuccess,
      onError,
      nameError,
      submitDisabled,
    });
  };

  return useForm<StaticVariableInput, StaticVariableState>(form, initialValue);
};
