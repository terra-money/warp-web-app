import classNames from 'classnames';
import React, { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { Throbber } from '../throbber';
import styles from './Button.module.sass';

type Variant = 'primary' | 'secondary' | 'danger';

type Fill = 'none' | undefined;

type Gutters = 'none' | 'small' | 'large';

type IconGap = 'small' | 'large' | 'none';

type IconAlignment = 'start' | 'end';

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fill?: Fill;
  gutters?: Gutters;
  icon?: ReactNode;
  disabled?: boolean;
  iconGap?: IconGap;
  iconAlignment?: IconAlignment;
  loading?: boolean;
}

const Button = forwardRef((props: ButtonProps, ref?: React.Ref<HTMLButtonElement>) => {
  const {
    className,
    children,
    variant = 'secondary',
    fill = undefined,
    gutters = 'small',
    icon,
    iconGap = 'small',
    iconAlignment = 'start',
    loading,
    ...rest
  } = props;

  return (
    <button
      ref={ref}
      className={classNames(
        className,
        styles.root,
        styles[variant],
        fill === undefined ? styles.fill : null,
        gutters === 'small' ? styles.guttersSmall : null,
        gutters === 'large' ? styles.guttersLarge : null,
        icon && iconAlignment === 'start' ? styles.iconAlignmentStart : null,
        icon && iconAlignment === 'end' ? styles.iconAlignmentEnd : null,
        icon && iconGap === 'small' ? styles.iconGapSmall : null,
        icon && iconGap === 'large' ? styles.iconGapLarge : null
      )}
      {...rest}
    >
      {loading === undefined || loading === false ? (
        <>
          {icon && iconAlignment === 'start' ? icon : null}
          {children}
          {icon && iconAlignment === 'end' ? icon : null}
        </>
      ) : (
        <Throbber dotClassName={styles.throbber} variant="secondary" size="small" />
      )}
    </button>
  );
});

export { Button };
