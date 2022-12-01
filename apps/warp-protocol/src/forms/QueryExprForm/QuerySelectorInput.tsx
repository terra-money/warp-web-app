import styles from './QuerySelectorInput.module.sass';

import { Autocomplete, InputAdornment } from '@mui/material';
import { FormControl } from 'components/form-control/FormControl';
import { MenuItem } from 'components/menu';
import { Text, TextInput, TextInputProps } from 'components/primitives';

interface BaseProps extends Pick<TextInputProps, 'value'> {
  className?: string;
  label: string;
  error?: string;
  valid?: boolean;
  onChange: (input: string) => void;
  value: string;
}

interface QuerySelectorInputProps extends BaseProps {
  options: string[];
}

const QuerySelectorInput = (props: QuerySelectorInputProps) => {
  const { className, error, value, onChange, options } = props;

  return (
    <FormControl label="Query selector" className={className} fullWidth>
      <Autocomplete
        value={value}
        fullWidth
        ListboxProps={{
          className: styles.autocomplete_listbox,
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
            placeholder="Type your query selector here (i.e. $.field)"
            margin="none"
            fullWidth
            error={error !== undefined}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <InputAdornment position="end">
                  {!!value && value.length > 0 && <Text variant="label">{`${value?.length ?? 0}/140`}</Text>}
                </InputAdornment>
              ),
            }}
          />
        )}
      />
    </FormControl>
  );
};

export { QuerySelectorInput };
