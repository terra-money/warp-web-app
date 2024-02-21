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
  value?: warp_resolver.FnValue;
  kind: warp_resolver.VariableKind;
  onChange: (value: warp_resolver.FnValue) => void;
  label?: string;
  className?: string;
}

const UpdateFnValueInput: React.FC<UpdateFnValueInputProps> = ({
  value,
  onChange,
  label = 'Update fn',
  className,
  kind,
}) => {
  const openUpdateFnDialog = useUpdateFnDialog();

  const { variables } = useCachedVariables();

  const handleEditClick = async () => {
    const updatedValue = await openUpdateFnDialog({ updateFn: value, kind });

    if (updatedValue) {
      onChange(updatedValue);
    }
  };

  return (
    <FormControl className={classNames(styles.root, className)} labelVariant="primary" label={label}>
      <Container className={styles.update_fn} direction="row">
        {value ? (
          <UpdateFnValue value={value} variables={variables} />
        ) : (
          <Text variant="label">Update function not defined.</Text>
        )}
        <PencilIcon className={styles.edit} onClick={handleEditClick} />
      </Container>
    </FormControl>
  );
};

export { UpdateFnValueInput };
