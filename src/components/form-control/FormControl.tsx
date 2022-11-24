import classNames from 'classnames';
import { Container, UIElementProps } from 'shared/components';
import { Text } from 'components/primitives';
import { FormControl as MuiFormControl } from '@mui/material';
import { forwardRef, Ref } from 'react';
import styles from './FormControl.module.sass';

interface FormControlProps extends UIElementProps {
  label: string;
  labelGap?: boolean;
  labelVariant?: 'primary' | 'secondary';
  helpText?: string;
  optional?: boolean;
  fullWidth?: boolean;
}

const FormControl = forwardRef((props: FormControlProps, ref: Ref<any>) => {
  const {
    className,
    children,
    label,
    labelGap = true,
    helpText,
    optional,
    labelVariant = 'primary',
    fullWidth,
  } = props;

  return (
    <MuiFormControl ref={ref} className={classNames(className, styles.root)} fullWidth={fullWidth}>
      <Container className={styles.top} direction="row">
        <Text
          className={classNames(styles.label, styles[`label_${labelVariant}`], {
            [styles.labelGap]: labelGap,
          })}
          tooltip={helpText}
          variant="label"
        >
          {label}
        </Text>
        {optional && (
          <Text className={classNames(styles.optional)} variant="label">
            Optional
          </Text>
        )}
      </Container>
      {children}
    </MuiFormControl>
  );
});

export { FormControl };
