import { InputAdornment } from '@mui/material';
import classNames from 'classnames';
import { TextInput, TextInputProps } from 'components/primitives/text-input';
import { FormControl } from 'components/form-control/FormControl';
import { ReactComponent as CheckIcon } from 'components/assets/Check.svg';
import styles from './WalletInput.module.sass';

interface BaseProps extends Pick<TextInputProps, 'value'> {
  className?: string;
  label: string;
  error?: string;
  placeholder?: string;
  valid?: boolean;
  onChange: (input: string) => void;
}

interface WalletInputProps extends BaseProps {}

const WalletInput = (props: WalletInputProps) => {
  const { className, label, error, valid, value, onChange, placeholder = 'Type a wallet address' } = props;

  return (
    <FormControl className={classNames(className, styles.root)} label={label}>
      <TextInput
        placeholder={placeholder}
        error={error !== undefined}
        helperText={error}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        InputProps={{
          endAdornment: (
            <>
              {valid && (
                <InputAdornment position="end">
                  <CheckIcon className={styles.check} />
                </InputAdornment>
              )}
            </>
          ),
        }}
      />
    </FormControl>
  );
};

export { WalletInput };
