import { FormFunction, FormInput, FormState, useForm } from '@terra-money/apps/hooks';
import { useMemo } from 'react';
import { warp_resolver } from '@terra-money/warp-sdk';

export interface QueryVariableInput {
  name: string;
  queryJson: string;
  kind: warp_resolver.VariableKind;
  querySelector: string;
  onSuccess?: warp_resolver.UpdateFnValue;
  onError?: warp_resolver.UpdateFnValue;
}

export interface QueryVariableState extends FormState<QueryVariableInput> {
  submitDisabled: boolean;
}

export type QueryVariableFormInput = FormInput<QueryVariableInput>;

export const queryVariableToInput = (queryVariable?: warp_resolver.QueryVariable): QueryVariableInput => {
  const queryJson = queryVariable ? JSON.stringify(queryVariable.init_fn.query, null, 2) : '';

  return {
    kind: queryVariable?.kind ?? ('' as any),
    name: queryVariable?.name ?? '',
    queryJson,
    querySelector: queryVariable?.init_fn.selector ?? '',
    onSuccess: queryVariable?.update_fn?.on_success ?? undefined,
    onError: queryVariable?.update_fn?.on_error ?? undefined,
  };
};

export const useQueryVariableForm = (queryVariable?: warp_resolver.QueryVariable) => {
  const initialValue = useMemo<QueryVariableState>(
    () => ({
      ...queryVariableToInput(queryVariable),
      submitDisabled: true,
    }),
    [queryVariable]
  );

  const form: FormFunction<QueryVariableInput, QueryVariableState> = async (input, getState, dispatch) => {
    const state = {
      ...getState(),
      ...input,
    };

    let queryJsonError = undefined;

    if (state.queryJson) {
      try {
        JSON.parse(state.queryJson);
      } catch (err) {
        queryJsonError = 'Message format invalid.';
      }
    }

    const nameError = state.name.length > 140 ? 'The name can not exceed the maximum of 140 characters' : undefined;
    const querySelectorError =
      state.querySelector.length > 140 ? 'The query selector can not exceed the maximum of 140 characters' : undefined;

    const querySelectorValid = !Boolean(
      state.querySelector === null || state.querySelector.length < 1 || querySelectorError
    );

    const submitDisabled = Boolean(
      state.name === undefined ||
        state.name === null ||
        state.name.length < 1 ||
        nameError ||
        state.queryJson === undefined ||
        state.queryJsonError ||
        querySelectorError ||
        !querySelectorValid
    );

    const isNumKind = ['decimal', 'uint', 'int'].includes(state.kind);

    const onSuccess = isNumKind ? state.onSuccess : undefined;
    const onError = isNumKind ? state.onError : undefined;

    dispatch({
      ...state,
      onSuccess,
      onError,
      nameError,
      queryJsonError,
      submitDisabled,
    });
  };

  return useForm<QueryVariableInput, QueryVariableState>(form, initialValue);
};

export const decodeQuery = (query?: warp_resolver.QueryRequestFor_String) => {
  if (!query) {
    return query;
  }

  if ('wasm' in query) {
    if ('smart' in query.wasm) {
      return {
        wasm: {
          smart: {
            ...query.wasm.smart,
            msg: fromBase64(query.wasm.smart.msg),
          },
        },
      };
    }

    if ('raw' in query.wasm) {
      return {
        wasm: {
          raw: {
            ...query.wasm.raw,
            raw: fromBase64(query.wasm.raw.key),
          },
        },
      };
    }
  }

  return query;
};

const fromBase64 = (value: string) => {
  return JSON.parse(Buffer.from(value, 'base64').toString());
};
