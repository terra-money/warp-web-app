import { PropsWithChildren } from 'react';
import { Sidebar } from './Sidebar';
import styles from './Layout.module.sass';
import { ReactComponent as BackgroundWrap } from 'components/assets/BackgroundWrap.svg';
import { Button, Text } from 'components/primitives';
import { useChainSelector } from '@terra-money/apps/hooks';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useChainSelectorDialog } from 'components/dialog/chain-selector/ChainSelectorDialog';

interface LayoutProps extends PropsWithChildren {}

export const Layout = ({ children }: LayoutProps) => {
  const { selectedChain } = useChainSelector();
  const openChainSelectorDialog = useChainSelectorDialog();

  return (
    <div className={styles.root}>
      <>
        <BackgroundWrap className={styles.background_wrap} />
        <Text variant="label" className={styles.protocol_name}>
          Warp protocol
        </Text>
        <Button
          className={styles.chain_selector}
          variant="secondary"
          icon={selectedChain.icon}
          onClick={() => openChainSelectorDialog({})}
          iconGap="none"
        >
          <Text variant="text" className={styles.chain_text}>
            {selectedChain.name}
          </Text>
          <KeyboardArrowDownIcon className={styles.chevron} />
        </Button>
      </>
      <Sidebar className={styles.sidebar} />
      <div className={styles.content}>{children}</div>
    </div>
  );
};
