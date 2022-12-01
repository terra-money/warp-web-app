import classNames from 'classnames';
import { ReactNode } from 'react';
import { ReactComponent as HelpIcon } from '../assets/Help.svg';
import { Tooltip } from '@mui/material';
import { UIElementProps } from '@terra-money/apps/components';
import styles from './Text.module.sass';

type ComponentName = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'sub';

type TextVariant = 'heading1' | 'heading2' | 'heading3' | 'heading4' | 'label' | 'text' | 'link';

export interface TextProps extends UIElementProps {
  variant: TextVariant;
  component?: ComponentName;
  weight?: 'normal' | 'bold' | 'default';
  children: ReactNode;
  tooltip?: string;
  onClick?: () => void;
}

const Text = (props: TextProps) => {
  const { className, variant, component = 'span', weight = 'default', onClick, children, tooltip } = props;
  const Component = component;
  return (
    <Component
      onClick={onClick}
      className={classNames(
        className,
        styles.root,
        styles[variant],
        {
          [styles[weight]]: weight !== 'default',
        },
        onClick && styles.clickable
      )}
      data-variant={variant}
    >
      {children}
      {tooltip && (
        <Tooltip
          classes={{
            popper: styles.tooltip,
          }}
          title={tooltip}
          arrow={true}
          placement="top"
        >
          <HelpIcon className={styles.tooltipIcon} />
        </Tooltip>
      )}
    </Component>
  );
};

export { Text };
