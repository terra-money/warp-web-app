import React from 'react';
import { FormControl } from 'components/form-control/FormControl';
import { useUpdateFnDialog } from './UpdateFnDialog';
import { Text } from 'components/primitives';
import { warp_resolver } from '@terra-money/warp-sdk';

import styles from './UpdateFnValueInput.module.sass';
import classNames from 'classnames';
import { UpdateFnValue } from 'pages/job-page/panels/Condition/typed-expressions/dialogs/expression/UpdateFnValue';
import { useCachedVariables } from 'pages/job-new/useCachedVariables';
import { Container } from '@terra-money/apps/components';
import { ReactComponent as PencilIcon } from 'components/assets/Pencil.svg';

interface UpdateFnValueInputProps {
  value?: warp_resolver.UpdateFnValue;
  onChange: (value: warp_resolver.UpdateFnValue) => void;
  label?: string;
  className?: string;
}

const UpdateFnValueInput: React.FC<UpdateFnValueInputProps> = ({ value, onChange, label = 'Update fn', className }) => {
  const openUpdateFnDialog = useUpdateFnDialog();

  const { variables } = useCachedVariables();

  const handleEditClick = async () => {
    const updatedValue = await openUpdateFnDialog({ updateFn: value });

    if (updatedValue) {
      onChange(updatedValue);
    }
  };

  return (
    <FormControl className={classNames(styles.root, className)} labelVariant="primary" label={label}>
      <Container className={styles.update_fn} direction="row" onClick={handleEditClick}>
        {value ? (
          <UpdateFnValue value={value} variables={variables} />
        ) : (
          <Text variant="label">Update function not defined.</Text>
        )}
        <PencilIcon className={styles.edit} />
      </Container>
    </FormControl>
  );
};

export { UpdateFnValueInput };
