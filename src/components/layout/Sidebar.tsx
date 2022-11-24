import classNames from 'classnames';
import { WalletWidget } from './wallet/WalletWidget';
import { NavigationMenu } from './NavigationMenu';
import { ReactComponent as ChatIcon } from 'components/assets/Chat.svg';
import styles from './Sidebar.module.sass';
import { useFeedbackDialog } from './feedback/FeedbackDialog';

interface SidebarProps {
  className?: string;
}

export const Sidebar = (props: SidebarProps) => {
  const className = classNames(styles.root, props.className);

  const openFeedbackDialog = useFeedbackDialog();

  return (
    <div className={className}>
      <NavigationMenu className={styles.navigationMenu} />
      <ChatIcon className={styles.chat} onClick={openFeedbackDialog} />
      <WalletWidget className={styles.wallet} />
    </div>
  );
};
