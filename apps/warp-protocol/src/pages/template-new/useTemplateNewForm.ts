import { FormFunction, FormInput, FormState, useForm } from '@terra-money/apps/hooks';
import { useMemo } from 'react';
import { isEmpty } from 'lodash';
import { warp_resolver, warp_templates } from '@terra-money/warp-sdk';
import { generatePaths } from 'utils';
import { hasOnlyStaticVariables, variableName } from 'utils/variable';
import { scanForReferences } from 'utils/msgs';

interface TemplateNewInput {
  name: string;
  vars: warp_resolver.Variable[];
  formattedStr: string;
  msg: string;
  paths: string[];
}

export interface TemplateNewState extends TemplateNewInput, FormState<TemplateNewInput> {
  submitDisabled: boolean;
}

export type TemplateNewFormInput = FormInput<TemplateNewInput>;

export const templateToInput = (template?: warp_templates.Template): TemplateNewInput => {
  return {
    name: template?.name ?? '',
    vars: template?.vars ?? [],
    formattedStr: template?.formatted_str ?? '',
    msg: template?.msg ?? '',
    paths: template?.msg ? generatePaths(template.msg) : [],
  };
};

export const useTemplateNewForm = (template?: warp_templates.Template) => {
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

    const unknownReferencesMsgError =
      !msgError &&
      !isEmpty(state.msg) &&
      Boolean(
        scanForReferences(JSON.parse(state.msg)).find((name) => state.vars.every((v) => variableName(v) !== name))
      )
        ? "Message can't contain unknown variable references."
        : undefined;

    msgError = msgError || unknownReferencesMsgError;

    const nameError = state.name.length > 140 ? 'The name can not exceed the maximum of 140 characters' : undefined;

    const formattedStrLengthError =
      state.formattedStr.length > 280 ? 'Template string must be shorter than 280 characters.' : undefined;

    const onlyStaticVarsFormatterStrError = !hasOnlyStaticVariables(state.formattedStr, state.vars)
      ? 'Only defined static variables can be referenced'
      : undefined;

    const formattedStrError = onlyStaticVarsFormatterStrError || formattedStrLengthError;

    const submitDisabled = Boolean(
      state.name === undefined ||
        state.name === null ||
        state.name.length < 1 ||
        nameError ||
        !state.formattedStr ||
        state.formattedStr.length < 1 ||
        !state.msg ||
        state.msg.length < 1 ||
        msgError ||
        formattedStrError
    );

    dispatch({
      ...state,
      paths,
      nameError,
      msgError,
      submitDisabled,
      formattedStrError,
    });
  };

  return useForm<TemplateNewInput, TemplateNewState>(form, initialValue);
};
