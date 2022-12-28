import { FormFunction, FormInput, FormState, useForm } from '@terra-money/apps/hooks';
import { useMemo } from 'react';
import { isEmpty } from 'lodash';
import { warp_controller } from 'types';
import { generatePaths } from 'utils';

interface TemplateNewInput {
  name: string;
  kind: warp_controller.TemplateKind;
  vars: TemplateVar[];
  formattedStr: string;
  msg: string;
  paths: string[];
}

export type TemplateVar = warp_controller.StaticVariable & {
  path: string;
};

export interface TemplateNewState extends TemplateNewInput, FormState<TemplateNewInput> {
  submitDisabled: boolean;
}

export type TemplateNewFormInput = FormInput<TemplateNewInput>;

export const templateToInput = (template?: warp_controller.Template): TemplateNewInput => {
  return {
    name: template?.name ?? '',
    kind: template?.kind ?? ('' as any),
    vars: (template?.vars.filter((v) => 'static' in v).map((v: any) => ({ ...v.static, path: '' })) ??
      []) as TemplateVar[],
    formattedStr: template?.formatted_str ?? '',
    msg: template?.msg ?? '',
    paths: template?.msg ? generatePaths(template.msg) : [],
  };
};

export const useTemplateNewForm = (template?: warp_controller.Template) => {
  const initialValue = useMemo<TemplateNewState>(() => {
    const res = {
      ...templateToInput(template),
      submitDisabled: true,
    };

    return res;
  }, [template]);

  const form: FormFunction<TemplateNewInput, TemplateNewState> = async (input, getState, dispatch) => {
    const state = {
      ...getState(),
      ...input,
    };

    const paths = input.msg ? generatePaths(input.msg) : state.paths;

    let msgError = undefined;

    if (state.msg) {
      try {
        JSON.parse(state.msg);
      } catch (err) {
        msgError = 'Message format invalid.';
      }
    }

    msgError = isEmpty(state.msg) ? 'Message must be set' : msgError;

    const nameError = state.name.length > 140 ? 'The name can not exceed the maximum of 140 characters' : undefined;

    const varsError = Boolean(
      state.vars.find((v) => isEmpty(v.kind) || isEmpty(v.name) || isEmpty(v.path) || !paths.includes(v.path))
    )
      ? 'All variables must be filled'
      : undefined;

    const kindError = isEmpty(state.kind) ? 'Template type must be assigned' : undefined;

    const formattedStrError = isEmpty(state.formattedStr) ? 'Template must be set' : undefined;

    const submitDisabled = Boolean(
      state.name === undefined ||
        state.name === null ||
        state.name.length < 1 ||
        nameError ||
        state.msg === undefined ||
        msgError ||
        varsError ||
        kindError ||
        formattedStrError
    );

    dispatch({
      ...state,
      paths,
      nameError,
      msgError,
      submitDisabled,
      varsError,
      kindError,
      formattedStrError,
    });
  };

  return useForm<TemplateNewInput, TemplateNewState>(form, initialValue);
};
