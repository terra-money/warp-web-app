import classNames from 'classnames';
import { PropsWithChildren } from 'react';
import styles from './Pill.module.sass';

type PillProps = PropsWithChildren & {
  color: 'green' | 'blue' | 'purple' | 'yellow';
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

export const Pill = ({ color, children, className, onClick }: PillProps) => {
  return (
    <div onClick={onClick} className={classNames(styles.pill, styles[`pill_${color}`], className)}>
      {children}
    </div>
  );
};
