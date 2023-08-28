import { InputAdornment } from '@mui/material';
import classNames from 'classnames';
import { FormControl } from 'components/form-control/FormControl';
import { ReactComponent as CheckIcon } from 'components/assets/Check.svg';
import { NumericInput, NumericInputProps } from 'components/primitives/numeric-input';
import { Text } from 'components/primitives/text';
import Big from 'big.js';
import { u } from '@terra-money/apps/types';
import { demicrofy, formatAmount } from '@terra-money/apps/libs/formatting';
import { Token } from '@terra-money/apps/types';
import { Throbber } from 'components/primitives';
import styles from './AmountInput.module.sass';

interface AmountInputProps extends Pick<NumericInputProps, 'value' | 'onChange'> {
  className?: string;
  label: string;
  error?: string;
  optional?: boolean;
  valid?: boolean;
  token?: Token;
  helperText?: string;
  balance?: u<Big>;
  balanceLoading?: boolean;
  onBalanceClick?: (balance: u<Big>) => void;
}

const AmountInput = (props: AmountInputProps) => {
  const {
    className,
    label,
    error,
    helperText,
    valid,
    value,
    onChange,
    optional,
    token,
    balance,
    balanceLoading,
    onBalanceClick,
  } = props;

  const formattedAmount =
    balance &&
    formatAmount(demicrofy(balance, token?.decimals ?? 6), {
      decimals: 2,
    });

  const endAdornment = (
    <InputAdornment position="end">
      {token && !balanceLoading && formattedAmount && (
        <Text onClick={() => onBalanceClick && onBalanceClick(balance)} variant="label">{`${formattedAmount} ${
          token?.symbol ?? ''
        }`}</Text>
      )}
      {token && balanceLoading && <Throbber size="small" variant="secondary" />}
      {valid && <CheckIcon className={styles.check} />}
    </InputAdornment>
  );

  return (
    <FormControl className={classNames(className, styles.root)} label={label} optional={optional}>
      <NumericInput
        placeholder="Type amount"
        error={error !== undefined}
        helperText={error ?? helperText}
        value={value}
        onChange={onChange}
        InputProps={{
          endAdornment,
        }}
      />
    </FormControl>
  );
};

export { AmountInput };
