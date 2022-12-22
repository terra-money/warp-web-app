import { FormFunction, FormInput, FormState, useForm } from '@terra-money/apps/hooks';
import { Query } from 'pages/queries/useQueryStorage';
import { useMemo } from 'react';
import { isEmpty } from 'lodash';
import { warp_controller } from 'types';
import { generatePaths } from 'utils';

export type TemplateWithVarValues = Omit<warp_controller.Template, 'vars'> & {
  vars: (warp_controller.TemplateVar & { value: string })[];
};

interface QueryExprInput {
  name: string;
  querySelector: string;
  queryJson: string;
  paths: string[];
  template?: TemplateWithVarValues;
  selectedTabType?: 'template' | 'message';
}

export interface QueryExprState extends FormState<QueryExprInput> {
  submitDisabled: boolean;
}

export type QueryExprFormInput = FormInput<QueryExprInput>;

export const queryExprToInput = (query?: Query): QueryExprInput => {
  const queryJson = query ? JSON.stringify(decodeQuery(query.query), null, 2) : '';

  return {
    name: query?.name ?? '',
    querySelector: query?.selector ?? '',
    queryJson,
    selectedTabType: !Boolean(query?.template) && Boolean(query?.query) ? 'message' : 'template',
    template: query?.template ?? undefined,
    paths: query ? generatePaths(queryJson) : [],
  };
};

export const useQueryExprForm = (query?: Query) => {
  const initialValue = useMemo<QueryExprState>(
    () => ({
      ...queryExprToInput(query),
      submitDisabled: true,
    }),
    [query]
  );

  const form: FormFunction<QueryExprInput, QueryExprState> = async (input, getState, dispatch) => {
    const state = {
      ...getState(),
      ...input,
    };

    const paths = input.queryJson ? generatePaths(input.queryJson) : state.paths;

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

    const templateError = Boolean(state.template?.vars.find((v) => isEmpty(v.value)))
      ? 'All variables must be filled.'
      : undefined;

    const submitDisabled = Boolean(
      state.name === undefined ||
        state.name === null ||
        state.name.length < 1 ||
        nameError ||
        state.queryJson === undefined ||
        state.queryJsonError ||
        querySelectorError ||
        !querySelectorValid ||
        templateError
    );

    dispatch({
      ...state,
      paths,
      nameError,
      queryJsonError,
      querySelectorValid,
      querySelectorError,
      templateError,
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
