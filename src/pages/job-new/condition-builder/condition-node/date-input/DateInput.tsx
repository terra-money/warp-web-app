import { InputAdornment } from '@mui/material';
import classNames from 'classnames';
import { TextInput } from 'components/primitives/text-input';
import { ReactComponent as CheckIcon } from 'components/assets/Check.svg';
import { ReactComponent as TimerIcon } from 'components/assets/Timer.svg';
import * as chrono from 'chrono-node';
import { useCallback, useState } from 'react';
import styles from './DateInput.module.sass';
import { useDateTimePicker } from 'components/datetime-picker';

interface DateInputProps {
  className?: string;
  placeholder?: string;
  valid?: boolean;
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
  const { className, placeholder = 'Type a date', valid, value, onChange } = props;

  const [editing, setEditing] = useState(false);

  const [text, setText] = useState<string>('');

  const displayText = editing ? text : value ? format(value) : text;

  const openDateTimePicker = useDateTimePicker();

  const onDateTimePickerClick = useCallback(async () => {
    const newDate = await openDateTimePicker();

    if (newDate) {
      setText(newDate.toDateString());
      onChange(newDate);
    }
  }, [openDateTimePicker, setText, onChange]);

  return (
    <TextInput
      className={classNames(className, styles.root)}
      placeholder={placeholder}
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
  );
};

export { DateInput };
