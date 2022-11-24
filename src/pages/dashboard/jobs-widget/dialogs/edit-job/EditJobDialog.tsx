import { Button, Text } from 'components/primitives';
import { DialogProps, useDialog } from 'shared/hooks';
import { useEditJobForm } from './useEditJobForm';
import { isMatch, isEmpty } from 'lodash';
import { useMemo } from 'react';
import { InputAdornment } from '@mui/material';
import { TextInput } from 'components/primitives/text-input';
import { FormControl } from 'components/form-control/FormControl';
import { Form } from 'components/form/Form';
import { Dialog, DialogBody, DialogFooter, DialogHeader } from 'components/dialog';
import { AmountInput } from '../../inputs/AmountInput';
import { microfy } from 'shared/libs/formatting';
import { Job } from 'types/job';
import { useEditJobTx } from 'tx';
import { LUNA } from 'types';

export type EditJobDialogProps = {
  job: Job;
};

export const EditJobDialog = (props: DialogProps<EditJobDialogProps>) => {
  const { closeDialog, job } = props;

  const [txResult, editJobTx] = useEditJobTx();

  const [input, { name, nameError, reward, rewardError, rewardValid, submitDisabled, balance, balanceLoading }] =
    useEditJobForm(job);

  const updatedJob = useMemo(
    () => ({
      ...job,
      name,
      reward,
    }),
    [job, name, reward]
  );

  const jobModified = useMemo(() => !isMatch(updatedJob, job), [updatedJob, job]);

  return (
    <Dialog>
      <Form>
        <DialogHeader title="Edit job" onClose={() => closeDialog(undefined)} />
        <DialogBody>
          <FormControl label="Name">
            <TextInput
              placeholder="Type name here"
              margin="none"
              value={name}
              onChange={(value) => {
                input({ name: value.target.value });
              }}
              helperText={nameError}
              error={nameError !== undefined}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {name && name.length > 0 && <Text variant="label">{`${name?.length ?? 0}/140`}</Text>}
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
          <AmountInput
            label="Increase reward by"
            value={reward}
            onChange={(value) =>
              input({
                reward: value.target.value,
              })
            }
            balance={balance}
            balanceLoading={balanceLoading}
            error={rewardError}
            token={LUNA}
            valid={rewardValid}
          />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="primary"
            loading={txResult.loading}
            disabled={submitDisabled}
            onClick={async () => {
              if (jobModified) {
                const resp = await editJobTx({
                  name,
                  jobId: job.info.id,
                  reward: !isEmpty(reward) ? microfy(reward, LUNA.decimals) : undefined,
                });

                if (resp.success) {
                  closeDialog(undefined, { closeAll: true });
                }
              }
            }}
          >
            Save
          </Button>
          <Button variant="secondary" onClick={() => closeDialog()}>
            Cancel
          </Button>
        </DialogFooter>
      </Form>
    </Dialog>
  );
};

export const useEditJobDialog = () => {
  return useDialog<EditJobDialogProps>(EditJobDialog);
};
