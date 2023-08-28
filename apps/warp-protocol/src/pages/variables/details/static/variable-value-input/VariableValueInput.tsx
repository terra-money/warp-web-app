import { demicrofy, microfy } from '@terra-money/apps/libs/formatting';
import { u } from '@terra-money/apps/types';
import Big from 'big.js';
import { TokenInput } from 'pages/balances/token-input/TokenInput';
import { DateInput } from 'pages/dashboard/jobs-widget/inputs/DateInput';
import { useTokens } from '@terra-money/apps/hooks';
import { NumericInput } from 'components/primitives/numeric-input';
import { UIElementProps } from '@terra-money/apps/components';
import { FormControl } from 'components/form-control/FormControl';
import { TextInput } from 'components/primitives/text-input';
import { AmountInput } from 'pages/dashboard/jobs-widget/inputs/AmountInput';
import { warp_resolver } from '@terra-money/warp-sdk';
import { MsgInput } from 'forms/QueryExprForm/MsgInput';

import styles from './VariableValueInput.module.sass';

type VariableValueInputProps = UIElementProps & {
  value: string;
  label?: string;
  placeholder?: string;
  kind?: warp_resolver.VariableKind;
  onChange: (v: string) => void;
};

export const VariableValueInput = (props: VariableValueInputProps) => {
  const { onChange, value, kind = '', label = 'Value', placeholder = 'Type your value here' } = props;

  const { tokens } = useTokens();

  if (['int', 'uint', 'decimal'].includes(kind)) {
    return (
      <FormControl label={label}>
        <NumericInput
          placeholder={placeholder}
          margin="none"
          value={value}
          onChange={(value) => {
            onChange(value.target.value);
          }}
        />
      </FormControl>
    );
  }

  if (kind === 'amount') {
    return (
      <AmountInput
        label={label}
        value={value && demicrofy(Big(value) as u<Big>, 6)}
        onChange={(value) =>
          onChange(value.target.value ? microfy(value.target.value, 6).toString() : (undefined as any))
        }
      />
    );
  }

  if (kind === 'timestamp') {
    const date = value ? new Date(Number(value) * 1000) : undefined;

    return (
      <DateInput
        label={label}
        placeholder={`Example: "tomorrow at 15:30"`}
        value={date}
        onChange={(v) => onChange(Math.floor((v?.getTime() ?? 0) / 1000).toString())}
      />
    );
  }

  if (kind === 'asset') {
    return (
      <TokenInput
        label={label}
        value={tokens[value]}
        onChange={(token) => {
          onChange(token.key);
        }}
      />
    );
  }

  if (kind === 'json') {
    return (
      <FormControl label={label}>
        <MsgInput
          placeholder={placeholder}
          value={value}
          rootClassName={styles.wasm_msg}
          mode="json"
          onChange={(value) => {
            onChange(value ?? '');
          }}
        />
      </FormControl>
    );
  }

  return (
    <FormControl label={label}>
      <TextInput
        placeholder={placeholder}
        margin="none"
        value={value}
        onChange={(value) => {
          onChange(value.target.value);
        }}
      />
    </FormControl>
  );
};
