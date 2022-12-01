import { Button, Text } from 'components/primitives';
import { useDialog, DialogProps } from '@terra-money/apps/hooks';
import { Dialog, DialogBody, DialogFooter, DialogHeader } from 'components/dialog';
import { startOfToday, addHours, addMinutes, format } from 'date-fns';

import styles from './MinutePicker.module.sass';
import { useCallback } from 'react';

const minutes = Array.from({ length: 12 }, (_, idx) => idx * 5);

type MinutePickerInput = {
  hour: number;
};

const formatTime = (hour: number, minute: number) =>
  format(addMinutes(addHours(startOfToday(), hour), minute), 'HH:mm');

export const MinutePicker = (props: DialogProps<MinutePickerInput, number>) => {
  const { closeDialog, hour } = props;

  const onMinuteClick = useCallback(
    (minute: number) => {
      closeDialog(minute);
    },
    [closeDialog]
  );

  return (
    <Dialog>
      <DialogHeader title="Select minute" onClose={() => closeDialog(undefined)} />
      <DialogBody className={styles.minutes}>
        {minutes.map((minute) => {
          return (
            <Button className={styles.minute} key={minute} onClick={() => onMinuteClick(minute)}>
              <Text variant="text" className={styles.minute}>
                {formatTime(hour, minute)}
              </Text>
            </Button>
          );
        })}
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => closeDialog(0)}>Skip</Button>
      </DialogFooter>
    </Dialog>
  );
};

export const useMinutePicker = () => {
  return useDialog<MinutePickerInput, number>(MinutePicker);
};
