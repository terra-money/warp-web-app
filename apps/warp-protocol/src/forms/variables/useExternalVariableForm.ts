import { FormFunction, FormInput, FormState, useForm } from '@terra-money/apps/hooks';
import { useMemo } from 'react';
import { warp_controller } from 'types';

export interface ExternalVariableInput {
  name: string;
  kind: warp_controller.VariableKind;
  body?: string | null;
  headers?: string[] | null;
  method?: warp_controller.Method | null;
  selector: string;
  url: string;
}

export interface ExternalVariableState extends FormState<ExternalVariableInput> {
  submitDisabled: boolean;
}

export type ExternalVariableFormInput = FormInput<ExternalVariableInput>;

export const externalVariableToInput = (externalVariable?: warp_controller.ExternalVariable): ExternalVariableInput => {
  return {
    kind: externalVariable?.kind ?? ('' as any),
    name: externalVariable?.name ?? '',
    body: externalVariable?.init_fn.body ?? null,
    headers: externalVariable?.init_fn.headers ?? null,
    method: externalVariable?.init_fn.method ?? null,
    selector: externalVariable?.init_fn.selector ?? '',
    url: externalVariable?.init_fn.url ?? '',
  };
};

export const useExternalVariableForm = (externalVariable?: warp_controller.ExternalVariable) => {
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

    const nameError = state.name.length > 140 ? 'The name can not exceed the maximum of 140 characters' : undefined;
    const kindError = !state.kind ? 'Variable type is required' : undefined;
    const urlError = !state.url ? 'URL is required' : undefined;
    const selectorError = !state.selector ? 'Selector is required' : undefined;

    const submitDisabled = Boolean(
      state.name === undefined ||
        state.name === null ||
        state.name.length < 1 ||
        nameError ||
        state.url === undefined ||
        urlError ||
        kindError ||
        state.selector === undefined ||
        selectorError
    );

    dispatch({
      ...state,
      nameError,
      submitDisabled,
    });
  };

  return useForm<ExternalVariableInput, ExternalVariableState>(form, initialValue);
};
