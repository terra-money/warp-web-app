import { Button, Text } from 'components/primitives';
import { useDialog, DialogProps } from '@terra-money/apps/hooks';
import { Dialog, DialogBody, DialogHeader } from 'components/dialog';
import {
  addDays,
  addHours,
  addMinutes,
  subMonths,
  addMonths,
  startOfToday,
  format,
  startOfMonth,
  getDay,
  subDays,
  endOfMonth,
} from 'date-fns';
import { ReactComponent as ArrowLeft } from 'components/assets/ArrowLeft.svg';
import { ReactComponent as ArrowRight } from 'components/assets/ArrowRight.svg';

import styles from './DateTimePicker.module.sass';
import { Container } from '@terra-money/apps/components';
import { useCallback, useMemo, useState } from 'react';
import { useTimePicker } from './time-picker';
import classNames from 'classnames';

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type DayPayload = {
  day: number;
  disabled: boolean;
};

const shiftedDay = (date: Date) => {
  // sunday is 0 by default, so moving sunday to 6
  return (getDay(date) + 6) % 7;
};

const daysInMonth = (date: Date): DayPayload[] => {
  const currentMonth = date.getMonth();
  let daysCount = 1;

  let iter = new Date(date);
  while (iter.getMonth() === currentMonth) {
    iter = addDays(iter, 1);
    daysCount++;
  }

  const currDays = Array.from({ length: daysCount - 1 }, (_, idx) => idx + 1).map((d) => ({ day: d, disabled: false }));
  const prevDays = prevMonthPaddedDays(date).map((d) => ({ day: d, disabled: true }));
  const nextDays = nextMonthPaddedDays(date).map((d) => ({ day: d, disabled: true }));

  const result = [...prevDays, ...currDays, ...nextDays];

  return result;
};

const prevMonthPaddedDays = (date: Date) => {
  const first = startOfMonth(date);
  const firstDay = shiftedDay(first);

  if (firstDay === 0) {
    return [];
  }

  let times = 1;
  let padded = [];

  while (times <= firstDay) {
    padded.push(Number(format(subDays(first, firstDay - times + 1), 'd')));
    times++;
  }

  return padded;
};

const nextMonthPaddedDays = (date: Date) => {
  const last = endOfMonth(date);
  const lastDay = shiftedDay(last);

  if (lastDay === 6) {
    return [];
  }

  let times = 1;
  let padded = [];

  while (times < 7 - lastDay) {
    padded.push(Number(format(addDays(last, times), 'd')));
    times++;
  }

  return padded;
};

export const DateTimePicker = (props: DialogProps<void, Date>) => {
  const { closeDialog } = props;
  const [date, setDate] = useState<Date>(startOfMonth(startOfToday()));

  const openTimePicker = useTimePicker();

  const days = useMemo(() => daysInMonth(date), [date]);

  const onDayClick = useCallback(
    async (day: number) => {
      const newDate = addDays(date, day - 1);
      const time = await openTimePicker();

      if (time !== undefined) {
        closeDialog(addMinutes(addHours(newDate, time.h), time.m));
      }
    },
    [openTimePicker, closeDialog, date]
  );

  const onPrevMonth = useCallback(() => {
    setDate((date) => subMonths(date, 1));
  }, [setDate]);

  const onNextMonth = useCallback(() => {
    setDate((date) => addMonths(date, 1));
  }, []);

  return (
    <Dialog className={styles.root}>
      <DialogHeader title="Select date" onClose={() => closeDialog(undefined)} />
      <DialogBody className={styles.content}>
        <Container className={styles.months} direction="row">
          <ArrowLeft className={styles.left} onClick={onPrevMonth} />
          <Text variant="text" className={styles.month}>
            {format(date, 'MMMM y')}
          </Text>
          <ArrowRight className={styles.right} onClick={onNextMonth} />
        </Container>
        <Container direction="row" className={styles.day_labels}>
          {dayLabels.map((label) => (
            <Text variant="label" key={label}>
              {label}
            </Text>
          ))}
        </Container>
        <div className={styles.days}>
          {days.map((d, idx) => {
            return (
              <Button
                className={classNames(styles.day, d.disabled && styles.disabled)}
                key={idx}
                disabled={d.disabled}
                onClick={() => onDayClick(d.day)}
              >
                <Text variant="text">{d.day}</Text>
              </Button>
            );
          })}
        </div>
      </DialogBody>
    </Dialog>
  );
};

export const useDateTimePicker = () => {
  return useDialog<void, Date>(DateTimePicker);
};
