import { useEffect, useState } from 'react';

export const useValueWithDelay = <T>(value: T, delay: number = 2000) => {
  const [delayedValue, setDelayedValue] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDelayedValue(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return delayedValue;
};
