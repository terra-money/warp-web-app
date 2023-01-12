import classNames from 'classnames';
import { PropsWithChildren } from 'react';
import styles from './Pill.module.sass';

type PillProps = PropsWithChildren & {
  color: 'green' | 'blue' | 'purple' | 'yellow';
  className?: string;
};

export const Pill = ({ color, children, className }: PillProps) => {
  return <div className={classNames(styles.pill, styles[`pill_${color}`], className)}>{children}</div>;
};
