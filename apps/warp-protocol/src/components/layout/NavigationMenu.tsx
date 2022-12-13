import classNames from 'classnames';
import { ReactNode } from 'react';
import { ReactComponent as JobsIcon } from 'components/assets/Jobs.svg';
import { ReactComponent as NewIcon } from 'components/assets/New.svg';
import { ReactComponent as DashboardIcon } from 'components/assets/Dashboard.svg';
import { ReactComponent as LightningStrokeIcon } from 'components/assets/LightningStroke.svg';
import { ReactComponent as DotsCircleIcon } from 'components/assets/DotsCircle.svg';
import { ReactComponent as AddressbookIcon } from 'components/assets/Addressbook.svg';
import { NavLink } from 'react-router-dom';
import styles from './NavigationMenu.module.sass';
import { useJobStorage } from 'pages/job-new/useJobStorage';

interface RouteProps {
  to: string;
  label: string;
  icon: ReactNode;
}

const routes: (clearJobStorage: () => void) => RouteProps[] = (clearJobStorage) => {
  return [
    { to: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { to: '/jobs', label: 'Jobs', icon: <JobsIcon /> },
    { to: '/balances', label: 'Balances', icon: <DotsCircleIcon /> },
    { to: '/queries', label: 'Queries', icon: <LightningStrokeIcon /> },
    { to: '/templates', label: 'Templates', icon: <AddressbookIcon /> },
    {
      to: '/job-new',
      label: 'New',
      icon: <NewIcon onClick={clearJobStorage} />,
    },
  ];
};

const Route = (props: RouteProps) => {
  const { icon, to } = props;

  return (
    <NavLink className={styles.route} to={to}>
      <span className={styles.icon}>{icon}</span>
    </NavLink>
  );
};

interface NavigationMenuProps {
  className: string;
}

export const NavigationMenu = (props: NavigationMenuProps) => {
  const { className } = props;
  const { clearJobStorage } = useJobStorage();

  return (
    <div className={classNames(className, styles.root)}>
      {routes(clearJobStorage).map((route) => (
        <Route {...route} key={route.label} />
      ))}
    </div>
  );
};
