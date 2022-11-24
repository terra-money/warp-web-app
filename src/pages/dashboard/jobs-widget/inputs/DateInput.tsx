import { InputAdornment } from '@mui/material';
import classNames from 'classnames';
import { TextInput } from 'components/primitives/text-input';
import { FormControl } from 'components/form-control/FormControl';
import { ReactComponent as CheckIcon } from 'components/assets/Check.svg';
import { ReactComponent as TimerIcon } from 'components/assets/Timer.svg';
import * as chrono from 'chrono-node';
import { isEmpty } from 'lodash';
import { useCallback, useState } from 'react';
import styles from './DateInput.module.sass';
import { useDateTimePicker } from 'components/datetime-picker';

interface DateInputProps {
  className?: string;
  label: string;
  placeholder?: string;
  error?: string;
  valid?: boolean;
  helpText?: string;
  value?: Date;
  onChange: (value?: Date) => void;
}

const format = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    dateStyle: 'long',
    timeStyle: 'short',
  };
  return Intl.DateTimeFormat(undefined, options).format(date);
};

const DateInput = (props: DateInputProps) => {
  const { className, label, placeholder = 'Type a date', error, valid, value, onChange, helpText } = props;

  const [editing, setEditing] = useState(false);

  const [text, setText] = useState<string>('');

  const [date, setDate] = useState<Date | undefined>();

  const helperText = editing && date ? format(date) : undefined;

  const displayText = editing ? text : value ? format(value) : text;

  const errorText = editing || isEmpty(text) ? undefined : error;

  const openDateTimePicker = useDateTimePicker();

  const onDateTimePickerClick = useCallback(async () => {
    const newDate = await openDateTimePicker();

    if (newDate) {
      setText(newDate.toDateString());
      setDate(newDate);
      onChange(newDate);
    }
  }, [openDateTimePicker, setDate, setText, onChange]);

  return (
    <FormControl className={classNames(className, styles.root)} label={label} helpText={helpText}>
      <TextInput
        placeholder={placeholder}
        error={!!errorText}
        helperText={errorText ?? helperText}
        value={displayText}
        onFocus={() => {
          setEditing(true);
        }}
        onBlur={() => {
          setEditing(false);
        }}
        onChange={(value) => {
          setText(value.target.value);

          const date = value.target.value ? chrono.parseDate(value.target.value) : undefined;

          setDate(date);
          onChange(date);
        }}
        InputProps={{
          endAdornment: (
            <>
              {valid && (
                <InputAdornment position="end">
                  <CheckIcon className={styles.check} />
                </InputAdornment>
              )}
              <InputAdornment position="end">
                <TimerIcon className={styles.timer} onClick={onDateTimePickerClick} />
              </InputAdornment>
            </>
          ),
        }}
      />
    </FormControl>
  );
};

export { DateInput };
