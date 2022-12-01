import { CircularProgress as Progress, CircularProgressProps as Props } from '@mui/material';
import { UIElementProps } from '@terra-money/apps/components';
import styles from './CircularProgress.module.sass';
import classNames from 'classnames';

export type CircularProgressProps = Props & {
  ContainerProps?: UIElementProps;
};

// This component is because the default circular progress doesn't have an outline for the entire circle
// The workaround is to have two of them, one placed absolutely behind the other with a value of 100%
export const CircularProgress = (props: CircularProgressProps) => {
  const { value, ContainerProps, className, ...otherProps } = props;

  return (
    <div className={classNames(styles.root)} {...ContainerProps}>
      <Progress value={value} className={className} {...otherProps} />
      <Progress variant={'determinate'} value={100} className={styles.back_progress} {...otherProps} />
    </div>
  );
};
