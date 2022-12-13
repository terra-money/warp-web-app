import { FormControl } from 'components/form-control/FormControl';
import { TextInputProps } from 'components/primitives';
import { QuerySelectorInputField } from './QuerySelectorInputField';

interface BaseProps extends Pick<TextInputProps, 'value'> {
  className?: string;
  label?: string;
  error?: string;
  valid?: boolean;
  hideAdornment?: boolean;
  onChange: (input: string) => void;
  value: string;
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
    label = 'Query selector',
    options,
    placeholder = 'Type your query selector here (i.e. $.field)',
  } = props;

  return (
    <FormControl label={label} className={className} fullWidth>
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
