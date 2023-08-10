import { Text } from 'components/primitives';
import { useDialog, DialogProps, useChainSelector, ChainMetadata } from '@terra-money/apps/hooks';
import { Dialog, DialogBody, DialogHeader } from 'components/dialog';
import { ReactComponent as CheckCircleIcon } from 'components/assets/CheckCircle.svg';
import styles from './ChainSelectorDialog.module.sass';
import { useCallback } from 'react';

type ChainSelectorDialogProps = {};

export const ChainSelectorDialog = (props: DialogProps<ChainSelectorDialogProps, boolean>) => {
  const { closeDialog } = props;

  const { supportedChains, selectedChain, setSelectedChain } = useChainSelector();

  const onSelectChain = useCallback(
    (chain: ChainMetadata) => {
      if (selectedChain.name !== chain.name) {
        setSelectedChain(chain.name);
      }

      closeDialog(true);
    },
    [setSelectedChain, closeDialog, selectedChain]
  );

  return (
    <Dialog className={styles.root}>
      <DialogHeader title={'Select chain'} onClose={() => closeDialog(undefined, { closeAll: true })} />
      <DialogBody className={styles.body}>
        {supportedChains.map((chain, idx) => {
          return (
            <div className={styles.chain} key={idx} onClick={() => onSelectChain(chain)}>
              <span className={styles.chain_icon}>{chain.icon}</span>
              <Text variant="text" className={styles.chain_name}>
                {chain.name}
              </Text>
              {chain.name === selectedChain.name && (
                <div className={styles.selected}>
                  <Text variant="text">Selected</Text>
                  <CheckCircleIcon className={styles.check} />
                </div>
              )}
            </div>
          );
        })}
      </DialogBody>
    </Dialog>
  );
};

export const useChainSelectorDialog = () => {
  return useDialog<ChainSelectorDialogProps, boolean>(ChainSelectorDialog);
};
