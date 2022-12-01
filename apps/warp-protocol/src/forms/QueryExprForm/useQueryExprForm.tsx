import { FormFunction, FormInput, useForm } from '@terra-money/apps/hooks';
import { useMemo } from 'react';
import { warp_controller } from 'types';

interface QueryExprInput {
  name: string;
  querySelector: string;
  queryJson: string;
}

export interface QueryExprState extends QueryExprInput {
  nameError?: string;
  nameValid?: boolean;
  queryJsonValid?: boolean;
  queryJsonError?: string;
  querySelectorValid?: boolean;
  querySelectorError?: string;
  submitDisabled: boolean;
}

export type QueryExprFormInput = FormInput<QueryExprInput>;

export const queryExprToInput = (query?: warp_controller.QueryExpr): QueryExprInput => {
  return {
    name: query?.name ?? '',
    querySelector: query?.selector ?? '',
    queryJson: query ? JSON.stringify(decodeQuery(query.query), null, 2) : '',
  };
};

export const useQueryExprForm = (queryExpr?: warp_controller.QueryExpr) => {
  const initialValue = useMemo<QueryExprState>(
    () => ({
      ...queryExprToInput(queryExpr),
      submitDisabled: true,
    }),
    [queryExpr]
  );

  const form: FormFunction<QueryExprInput, QueryExprState> = async (input, getState, dispatch) => {
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

    dispatch({
      ...state,
      nameError,
      queryJsonError,
      querySelectorValid,
      querySelectorError,
      submitDisabled,
    });
  };

  return useForm<QueryExprInput, QueryExprState>(form, initialValue);
};

export const decodeQuery = (query?: warp_controller.QueryRequestFor_String) => {
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
