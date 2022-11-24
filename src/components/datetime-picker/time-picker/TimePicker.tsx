import { Button, Text } from 'components/primitives';
import { useDialog, DialogProps } from 'shared/hooks';
import { format, addHours, startOfToday } from 'date-fns';
import { Dialog, DialogBody, DialogFooter, DialogHeader } from 'components/dialog';

import styles from './TimePicker.module.sass';
import { useCallback } from 'react';
import { useMinutePicker } from '../minute-picker';

type Time = {
  h: number;
  m: number;
};

const hours = Array.from({ length: 24 }, (_, idx) => idx);

const formatTime = (hour: number) => format(addHours(startOfToday(), hour), 'HH:mm');

export const TimePicker = (props: DialogProps<void, Time>) => {
  const { closeDialog } = props;

  const openMinutePicker = useMinutePicker();

  const onHourClick = useCallback(
    async (hour: number) => {
      const minute = await openMinutePicker({ hour });

      if (minute !== undefined) {
        closeDialog({
          h: hour,
          m: minute,
        });
      }
    },
    [openMinutePicker, closeDialog]
  );

  return (
    <Dialog>
      <DialogHeader title="Select hour" onClose={() => closeDialog(undefined)} />
      <DialogBody className={styles.hours}>
        {hours.map((hour) => {
          return (
            <Button className={styles.hour} key={hour} onClick={() => onHourClick(hour)}>
              <Text variant="text" className={styles.hour}>
                {formatTime(hour)}
              </Text>
            </Button>
          );
        })}
      </DialogBody>
      <DialogFooter>
        <Button onClick={() => closeDialog({ h: 0, m: 0 })}>Skip</Button>
      </DialogFooter>
    </Dialog>
  );
};

export const useTimePicker = () => {
  return useDialog<void, Time>(TimePicker);
};
