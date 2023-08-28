import { FormFunction, FormState, useForm } from '@terra-money/apps/hooks';
import { useMemo } from 'react';
import { warp_templates } from '@terra-money/warp-sdk';

export interface EditTemplateInput {
  name: string;
}

export interface EditTemplateState extends FormState<EditTemplateInput> {
  submitDisabled: boolean;
}

export const useEditTemplateForm = (template: warp_templates.Template) => {
  const initialValue = useMemo<EditTemplateState>(
    () => ({
      name: template.name,
      submitDisabled: true,
    }),
    [template]
  );

  const form: FormFunction<EditTemplateInput, EditTemplateState> = async (input, getState, dispatch) => {
    const state = {
      ...getState(),
      ...input,
    };

    const nameError = state.name.length > 140 ? 'The name can not exceed the maximum of 140 characters' : undefined;

    const submitDisabled = Boolean(
      state.name === undefined || state.name === null || state.name.length < 1 || nameError
    );

    dispatch({
      ...state,
      nameError,
      submitDisabled,
    });
  };

  return useForm<EditTemplateInput, EditTemplateState>(form, initialValue);
};
