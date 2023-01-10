import { PropsWithChildren } from 'react';
import { Sidebar } from './Sidebar';
import styles from './Layout.module.sass';
import { ReactComponent as BackgroundWrap } from 'components/assets/BackgroundWrap.svg';
import { Text } from 'components/primitives';

interface LayoutProps extends PropsWithChildren {}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.root}>
      <>
        <BackgroundWrap className={styles.background_wrap} />
        <Text variant="label" className={styles.protocol_name}>
          Warp protocol
        </Text>
        <span className={styles.beta_pill}>Beta</span>
      </>
      <Sidebar className={styles.sidebar} />
      <div className={styles.content}>{children}</div>
    </div>
  );
};
