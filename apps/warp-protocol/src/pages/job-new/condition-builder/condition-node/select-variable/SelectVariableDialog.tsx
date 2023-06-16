import { useMemo } from 'react';
import { Button, Text } from 'components/primitives';
import { FixedSizeList } from 'react-window';
import { DialogProps, useDialog } from '@terra-money/apps/hooks';
import classNames from 'classnames';
import { Dialog, DialogBody, DialogFooter, DialogHeader } from 'components/dialog';
import { ListData } from './ListData';
import { ListItem } from './ListItem';
import styles from './SelectVariableDialog.module.sass';
import { pluralize } from '@terra-money/apps/utils';
import { Container } from '@terra-money/apps/components';
import { useNewVariableDialog } from 'pages/variables/dialogs/VariableDialog';
import { useCachedVariables } from 'pages/job-new/useCachedVariables';
import { warp_controller } from 'types';

type SelectVariableProps = {
  selectedVariable?: warp_controller.Variable;
};

const SelectVariableDialog = (props: DialogProps<SelectVariableProps, warp_controller.Variable>) => {
  const { closeDialog, selectedVariable } = props;

  const { variables, saveVariable } = useCachedVariables();

  const listData = useMemo<ListData>(() => {
    const onSelectionChanged = (variable: warp_controller.Variable) => {
      closeDialog(variable);
    };

    return {
      selectedVariable,
      variables,
      onSelectionChanged,
    };
  }, [variables, closeDialog, selectedVariable]);

  const openNewVariableDialog = useNewVariableDialog();

  return (
    <Dialog>
      <DialogHeader title="Select variable" onClose={() => closeDialog(undefined)} />
      <DialogBody className={styles.container}>
        <Container className={classNames(styles.columns)} direction="row">
          <Text variant="label">{`Displaying ${listData.variables.length} ${pluralize(
            'variable',
            listData.variables.length
          )}`}</Text>
        </Container>
        <FixedSizeList<ListData>
          className={styles.list}
          itemData={listData}
          height={300}
          width={520}
          itemSize={60}
          itemCount={listData.variables.length}
          overscanCount={5}
        >
          {ListItem}
        </FixedSizeList>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="secondary"
          className={styles.new}
          onClick={async () => {
            const resp = await openNewVariableDialog({});

            if (resp) {
              saveVariable(resp);
              closeDialog(resp);
            }
          }}
        >
          New variable
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export const useSelectVariableDialog = () => {
  return useDialog<SelectVariableProps, warp_controller.Variable>(SelectVariableDialog);
};
