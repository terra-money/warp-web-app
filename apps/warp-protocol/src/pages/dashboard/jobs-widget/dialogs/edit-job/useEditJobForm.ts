import { FormFunction, useForm } from '@terra-money/apps/hooks';
import { useMemo } from 'react';
import { Job } from 'types/job';

interface EditJobInput {
  name: string;
  description: string;
}

interface EditJobState extends EditJobInput {
  nameError?: string;
  descriptionError?: string;
  nameValid?: boolean;
  descriptionValid?: boolean;
  submitDisabled: boolean;
}

export const useEditJobForm = (job: Job) => {
  const initialValue = useMemo<EditJobState>(
    () => ({
      name: job.info.name,
      description: job.info.description,
      submitDisabled: true,
    }),
    [job]
  );

  const form: FormFunction<EditJobInput, EditJobState> = async (input, getState, dispatch) => {
    const state = {
      ...getState(),
      ...input,
    };

    const nameError = state.name.length > 140 ? 'The name can not exceed the maximum of 140 characters' : undefined;

    const descriptionError =
      state.description.length > 200 ? 'The description can not exceed the maximum of 200 characters' : undefined;

    const submitDisabled = Boolean(
      state.name === undefined || state.name === null || state.name.length < 1 || nameError || descriptionError
    );

    dispatch({
      ...state,
      nameError,
      descriptionError,
      submitDisabled,
    });
  };

  return useForm<EditJobInput, EditJobState>(form, initialValue);
};
