import styles from './QuerySelectorInput.module.sass';

import { Autocomplete, InputAdornment } from '@mui/material';
import { MenuItem } from 'components/menu';
import { Text, TextInput, TextInputProps } from 'components/primitives';
import classNames from 'classnames';

interface BaseProps extends Pick<TextInputProps, 'value'> {
  className?: string;
  error?: string;
  valid?: boolean;
  hideAdornment?: boolean;
  onChange: (input: string) => void;
  value: string;
  placeholder?: string;
}

interface QuerySelectorInputFieldProps extends BaseProps {
  options: string[];
}

const QuerySelectorInputField = (props: QuerySelectorInputFieldProps) => {
  const {
    className,
    error,
    value,
    onChange,
    hideAdornment,
    options,
    placeholder = 'Type your query selector here (i.e. $.field)',
  } = props;

  return (
    <Autocomplete
      value={value}
      fullWidth
      className={classNames(styles.root, className)}
      ListboxProps={{
        className: classNames(styles.autocomplete_listbox, options.length < 4 && styles.full_height),
      }}
      options={options}
      freeSolo
      onChange={(event, newValue) => {
        onChange(newValue as string);
      }}
      onInputChange={(event, value) => {
        onChange(value);
      }}
      renderOption={(props, option) => (
        <MenuItem {...(props as any)} className={styles.autocomplete_option}>
          {option}
        </MenuItem>
      )}
      renderInput={(params) => (
        <TextInput
          {...params}
          placeholder={placeholder}
          margin="none"
          fullWidth
          error={error !== undefined}
          InputProps={{
            ...params.InputProps,
            endAdornment: !hideAdornment && (
              <InputAdornment position="end">
                {!!value && value.length > 0 && <Text variant="label">{`${value?.length ?? 0}/140`}</Text>}
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
};

export { QuerySelectorInputField };
