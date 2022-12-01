import { TextField, StandardTextFieldProps } from '@mui/material';
import classNames from 'classnames';
import styles from './TextInput.module.sass';
import { forwardRef } from 'react';

export interface TextInputProps extends StandardTextFieldProps {}

const TextInput = forwardRef<HTMLDivElement, TextInputProps>((props: TextInputProps, ref) => {
  const { className, ...rest } = props;
  return (
    <TextField
      {...rest}
      ref={ref}
      className={classNames(className, styles.root)}
      variant="outlined"
      autoComplete="off"
    />
  );
});

export { TextInput };
