import { Button, Text } from 'components/primitives';
import { DialogProps, useDialog } from '@terra-money/apps/hooks';
import { isMatch } from 'lodash';
import { useMemo } from 'react';
import { InputAdornment } from '@mui/material';
import { TextInput } from 'components/primitives/text-input';
import { FormControl } from 'components/form-control/FormControl';
import { Form } from 'components/form/Form';
import { Dialog, DialogBody, DialogFooter, DialogHeader } from 'components/dialog';
import { useEditTemplateTx } from 'tx';
import { warp_templates } from '@terra-money/warp-sdk';
import { useEditTemplateForm } from './useEditTemplateForm';

export type EditTemplateDialogProps = {
  template: warp_templates.Template;
};

export const EditTemplateDialog = (props: DialogProps<EditTemplateDialogProps>) => {
  const { closeDialog, template } = props;

  const [txResult, editTemplateTx] = useEditTemplateTx();

  const [input, { name, nameError, submitDisabled }] = useEditTemplateForm(template);

  const updatedTemplate = useMemo(
    () => ({
      ...template,
      name,
    }),
    [template, name]
  );

  const templateModified = useMemo(() => !isMatch(updatedTemplate, template), [updatedTemplate, template]);

  return (
    <Dialog>
      <Form>
        <DialogHeader title="Edit template" onClose={() => closeDialog(undefined)} />
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
        </DialogBody>
        <DialogFooter>
          <Button
            variant="primary"
            loading={txResult.loading}
            disabled={submitDisabled}
            onClick={async () => {
              if (templateModified) {
                const resp = await editTemplateTx({
                  name,
                  id: template.id,
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

export const useEditTemplateDialog = () => {
  return useDialog<EditTemplateDialogProps>(EditTemplateDialog);
};
