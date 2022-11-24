import { FormFunction, useForm } from 'shared/hooks';
import { useMemo } from 'react';
import { warp_controller } from 'types';
import { validateAddress } from 'utils/validateAddress';

export type ConditionStatus = 'Active' | 'Inactive';

interface JobFiltersInput {
  name: string;
  owner: string;
  job_status?: warp_controller.JobStatus | null;
}

interface JobFiltersState extends JobFiltersInput {
  nameError?: string;
  nameValid?: boolean;
  ownerError?: string;
  ownerValid?: boolean;
  submitDisabled: boolean;
}

export const useJobFiltersForm = (opts: warp_controller.QueryJobsMsg) => {
  const initialValue = useMemo<JobFiltersState>(
    () => ({
      name: opts.name ?? '',
      owner: opts.owner ?? '',
      job_status: undefined ?? opts.job_status,
      submitDisabled: false,
    }),
    [opts]
  );

  const form: FormFunction<JobFiltersInput, JobFiltersState> = async (input, getState, dispatch) => {
    const state = {
      ...getState(),
      ...input,
    };

    const nameError = state.name.length > 140 ? 'The name can not exceed the maximum of 140 characters' : undefined;

    const ownerError = state.owner ? validateAddress(state.owner) : undefined;

    const ownerValid = state.owner.length > 0 && ownerError === undefined;

    const submitDisabled = Boolean(nameError || ownerError);

    dispatch({
      ...state,
      nameError,
      ownerError,
      ownerValid,
      submitDisabled,
    });
  };

  return useForm<JobFiltersInput, JobFiltersState>(form, initialValue);
};
