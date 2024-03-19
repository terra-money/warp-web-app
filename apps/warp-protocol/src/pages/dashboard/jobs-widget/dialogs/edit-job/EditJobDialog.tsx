import { Button, Text } from 'components/primitives';
import { DialogProps, useDialog } from '@terra-money/apps/hooks';
import { useEditJobForm } from './useEditJobForm';
import { isMatch } from 'lodash';
import { useMemo } from 'react';
import { InputAdornment } from '@mui/material';
import { TextInput } from 'components/primitives/text-input';
import { FormControl } from 'components/form-control/FormControl';
import { Form } from 'components/form/Form';
import { Dialog, DialogBody, DialogFooter, DialogHeader } from 'components/dialog';
import { Job } from 'types/job';
import { useEditJobTx } from 'tx';

import styles from './EditJobDialog.module.sass';

export type EditJobDialogProps = {
  job: Job;
};

export const EditJobDialog = (props: DialogProps<EditJobDialogProps>) => {
  const { closeDialog, job } = props;

  const [txResult, editJobTx] = useEditJobTx();

  const [input, { name, nameError, submitDisabled, description, descriptionError }] = useEditJobForm(job);

  const jobModified = useMemo(() => !isMatch(job, { name, description }), [name, description, job]);

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
          <FormControl label="Description" className={styles.description_input}>
            <TextInput
              placeholder="Type a comprehensive description of the job. Your precise details will help us tailor AI assistance."
              margin="none"
              className={styles.description_inner}
              multiline={true}
              value={description}
              onChange={(value) => {
                input({ description: value.target.value });
              }}
              helperText={descriptionError}
              error={descriptionError !== undefined}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {description && description.length > 0 && (
                      <Text className={styles.textarea_label} variant="label">{`${description?.length ?? 0}/200`}</Text>
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
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
                  description,
                  jobId: job.info.id,
                });

                if (resp.code !== 0) {
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
