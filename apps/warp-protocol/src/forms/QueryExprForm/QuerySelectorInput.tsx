import { FormControl } from 'components/form-control/FormControl';
import { TextInputProps } from 'components/primitives';
import { QuerySelectorInputField } from './QuerySelectorInputField';
import styles from './QuerySelectorInput.module.sass';
import classNames from 'classnames';

interface BaseProps extends Pick<TextInputProps, 'value'> {
  className?: string;
  label?: string;
  error?: string;
  valid?: boolean;
  hideAdornment?: boolean;
  onChange: (input: string) => void;
  value: string;
  endLabel?: JSX.Element;
  placeholder?: string;
}

interface QuerySelectorInputProps extends BaseProps {
  options: string[];
}

const QuerySelectorInput = (props: QuerySelectorInputProps) => {
  const {
    className,
    error,
    value,
    onChange,
    hideAdornment,
    endLabel,
    label = 'Query selector',
    options,
    placeholder = 'Type your query selector here (i.e. $.field)',
  } = props;

  return (
    <FormControl label={label} className={classNames(styles.root, className)} fullWidth>
      {endLabel && <div className={styles.endLabel}>{endLabel}</div>}
      <QuerySelectorInputField
        error={error}
        value={value}
        onChange={onChange}
        hideAdornment={hideAdornment}
        options={options}
        placeholder={placeholder}
      />
    </FormControl>
  );
};

export { QuerySelectorInput };
