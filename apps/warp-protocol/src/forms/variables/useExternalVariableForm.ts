import { FormFunction, FormInput, FormState, useForm } from '@terra-money/apps/hooks';
import { useMemo } from 'react';
import { warp_resolver } from '@terra-money/warp-sdk';

export interface ExternalVariableInput {
  name: string;
  kind: warp_resolver.VariableKind;
  body?: string | null;
  headers?: object | null;
  method?: warp_resolver.Method | null;
  onSuccess?: warp_resolver.UpdateFnValue;
  onError?: warp_resolver.UpdateFnValue;
  selector: string;
  url: string;
}

export interface ExternalVariableState extends FormState<ExternalVariableInput> {
  submitDisabled: boolean;
}

export type ExternalVariableFormInput = FormInput<ExternalVariableInput>;

export const externalVariableToInput = (externalVariable?: warp_resolver.ExternalVariable): ExternalVariableInput => {
  return {
    kind: externalVariable?.kind ?? ('' as any),
    name: externalVariable?.name ?? '',
    body: externalVariable?.init_fn.body ?? null,
    headers: externalVariable?.init_fn.headers ?? null,
    method: externalVariable?.init_fn.method ?? null,
    selector: externalVariable?.init_fn.selector ?? '',
    url: externalVariable?.init_fn.url ?? '',
    onSuccess: externalVariable?.update_fn?.on_success ?? undefined,
    onError: externalVariable?.update_fn?.on_error ?? undefined,
  };
};

export const useExternalVariableForm = (externalVariable?: warp_resolver.ExternalVariable) => {
  const initialValue = useMemo<ExternalVariableState>(
    () => ({
      ...externalVariableToInput(externalVariable),
      submitDisabled: true,
    }),
    [externalVariable]
  );

  const form: FormFunction<ExternalVariableInput, ExternalVariableState> = async (input, getState, dispatch) => {
    const state = {
      ...getState(),
      ...input,
    };

    let bodyError = undefined;

    if (state.body) {
      try {
        JSON.parse(state.body);
      } catch (err) {
        bodyError = 'body format invalid.';
      }
    }

    const nameError = state.name.length > 140 ? 'The name can not exceed the maximum of 140 characters' : undefined;
    const kindError = !state.kind ? 'Variable type is required' : undefined;
    const urlError = !state.url ? 'URL is required' : undefined;
    const selectorError = !state.selector ? 'Selector is required' : undefined;
    const methodError = !state.selector ? 'Method is required' : undefined;

    const submitDisabled = Boolean(
      state.name === undefined ||
        state.name === null ||
        state.name.length < 1 ||
        nameError ||
        state.url === undefined ||
        urlError ||
        kindError ||
        state.selector === undefined ||
        selectorError ||
        bodyError ||
        methodError
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
      bodyError,
    });
  };

  return useForm<ExternalVariableInput, ExternalVariableState>(form, initialValue);
};
