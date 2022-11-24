import { Button, Text } from 'components/primitives';
import { DialogProps, useDialog } from 'shared/hooks';
import { Form } from 'components/form/Form';
import { Dialog, DialogBody, DialogFooter, DialogHeader } from 'components/dialog';
import styles from './JobFiltersDialog.module.sass';
import { pickBy } from 'lodash';
import { FormControl } from 'components/form-control/FormControl';
import { TextInput } from 'components/primitives/text-input';
import { InputAdornment } from '@mui/material';
import { WalletInput } from '../../inputs/WalletInput';
import { useJobFiltersForm } from './useJobFiltersForm';
import { warp_controller } from 'types';
import { StatusInput } from './status-input/StatusInput';
import { Container } from 'shared/components';

export type JobFiltersDialogProps = {
  opts: warp_controller.QueryJobsMsg;
};

const jobStatusOptions: warp_controller.JobStatus[] = ['Pending', 'Executed', 'Failed', 'Cancelled'];

export const JobFiltersDialog = (props: DialogProps<JobFiltersDialogProps, warp_controller.QueryJobsMsg>) => {
  const { closeDialog, opts } = props;

  const [input, { name, nameError, owner, ownerError, ownerValid, submitDisabled, job_status }] =
    useJobFiltersForm(opts);

  return (
    <Dialog>
      <Form>
        <DialogHeader title="Filters" onClose={() => closeDialog(undefined)} />
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
          <WalletInput
            label="Wallet address"
            value={owner}
            onChange={(value) => {
              input({
                owner: value,
              });
            }}
            error={ownerError}
            valid={ownerValid}
          />
          <Container direction="row" className={styles.split_row}>
            <StatusInput<warp_controller.JobStatus>
              label="Job status"
              placeholder="Select status"
              options={jobStatusOptions}
              value={job_status}
              disableClear={true}
              onChange={(job_status) => input({ job_status })}
            />
          </Container>
        </DialogBody>
        <DialogFooter>
          <Button
            className={styles.btn}
            disabled={submitDisabled}
            variant="primary"
            onClick={async () => {
              const newOpts = pickBy(
                {
                  name,
                  owner,
                  job_status,
                },
                (v) => v !== undefined && v !== ''
              );

              closeDialog(newOpts, { closeAll: true });
            }}
          >
            Apply
          </Button>
          <Button className={styles.btn} variant="secondary" onClick={() => closeDialog({})}>
            Clear all
          </Button>
        </DialogFooter>
      </Form>
    </Dialog>
  );
};

export const useJobFiltersDialog = () => {
  return useDialog<JobFiltersDialogProps, warp_controller.QueryJobsMsg>(JobFiltersDialog);
};
