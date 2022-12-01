import classNames from 'classnames';
import { PropsWithChildren, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../button';
import styles from './Link.module.sass';

type LinkProps = PropsWithChildren & {
  className?: string;
  to?: string | -1;
  onClick?: () => void;
};

export const Link = ({ to, children, className, onClick }: LinkProps) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    if (to) {
      navigate(to as string);
    } else {
      onClick?.();
    }
  }, [navigate, to, onClick]);

  return (
    <Button className={classNames(styles.root, className)} variant="primary" fill="none" onClick={handleClick}>
      {children}
    </Button>
  );
};
