import { FormFunction, FormInput, FormState, useForm } from '@terra-money/apps/hooks';
import { QueryVariable } from 'pages/variables/useVariableStorage';
import { useMemo } from 'react';
import { isEmpty } from 'lodash';
import { warp_controller } from 'types';
import { generatePaths } from 'utils';
import { templateVariables } from 'utils/variable';

interface QueryVariableInput {
  name: string;
  queryJson: string;
  kind: warp_controller.VariableKind;
  paths: string[];
  querySelector: string;
  template?: warp_controller.Template;
  selectedTabType: 'template' | 'message';
}

export interface QueryVariableState extends FormState<QueryVariableInput> {
  submitDisabled: boolean;
}

export type QueryVariableFormInput = FormInput<QueryVariableInput>;

export const queryVariableToInput = (queryVariable?: QueryVariable): QueryVariableInput => {
  const queryJson = queryVariable ? JSON.stringify(decodeQuery(queryVariable.default_value.query), null, 2) : '';

  return {
    kind: queryVariable?.kind ?? ('' as any),
    name: queryVariable?.name ?? '',
    queryJson,
    querySelector: queryVariable?.default_value.selector ?? '',
    template: queryVariable?.template ?? undefined,
    selectedTabType:
      !Boolean(queryVariable?.template) && Boolean(queryVariable?.default_value.query) ? 'message' : 'template',
    paths: queryVariable ? generatePaths(queryJson) : [],
  };
};

export const useQueryVariableForm = (queryVariable?: QueryVariable) => {
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

    const templateError = Boolean(
      state.template && templateVariables(state.template).find((v) => isEmpty(v.default_value))
    )
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
      submitDisabled,
    });
  };

  return useForm<QueryVariableInput, QueryVariableState>(form, initialValue);
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
