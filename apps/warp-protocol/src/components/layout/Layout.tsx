import { PropsWithChildren } from 'react';
import { Sidebar } from './Sidebar';
import styles from './Layout.module.sass';
import { ReactComponent as BackgroundWrap } from 'components/assets/BackgroundWrap.svg';
import { Text } from 'components/primitives';
import { useChainSelector } from '@terra-money/apps/hooks';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useChainSelectorDialog } from 'components/dialog/chain-selector/ChainSelectorDialog';
import { useMediaQuery } from 'usehooks-ts';

interface LayoutProps extends PropsWithChildren {}

const MobileWarning = () => (
  <div className={styles.mobile_warning}>
    <div className={styles.logo}>warp.</div>
    <div className={styles.center}>
      <Text variant="text" className={styles.warning_text}>
        Mobile Layout Not Supported
      </Text>
      <Text variant="label" className={styles.warning_label}>
        Please visit from a desktop to access the app.
      </Text>
    </div>

    <img alt="" src="images/BackgroundBigBall.png" className={styles.mobile_background_warp} />
  </div>
);

export const Layout = ({ children }: LayoutProps) => {
  const { selectedChain } = useChainSelector();
  const openChainSelectorDialog = useChainSelectorDialog();

  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className={styles.root}>
      {isMobile ? (
        <MobileWarning />
      ) : (
        <>
          <BackgroundWrap className={styles.background_wrap} />
          <Text variant="label" className={styles.protocol_name}>
            Warp protocol
          </Text>
          <div className={styles.chain_selector} onClick={() => openChainSelectorDialog({})}>
            <div className={styles.chain_icon}>{selectedChain.icon}</div>
            <Text variant="text" className={styles.chain_text}>
              {selectedChain.name}
            </Text>
            <KeyboardArrowDownIcon className={styles.chevron} />
          </div>
          <Sidebar className={styles.sidebar} />
          <div className={styles.content}>{children}</div>
        </>
      )}
    </div>
  );
};
