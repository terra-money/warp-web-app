import React, { useEffect, useRef, useState } from 'react';
import AnimatedText, { AnimatedTextProps } from './AnimatedText';
import styles from './AnimatedDisplay.module.sass';
import WaveSlider from './WaveSlider';
import classNames from 'classnames';
import { UIElementProps } from '@terra-money/apps/components';

interface Props extends UIElementProps {}

const texts: AnimatedTextProps[] = [
  {
    text: 'A developer or one of their users creates a job, specifying what they want the job to do, the conditions under which it will execute, and its execution reward.',
    label: '01',
    heading: 'A job is created and sent to the Warp job queue',
  },
  {
    text: 'Warp’s network of keeper bots checks to see if the job’s conditions have been satisfied',
    label: '02',
    heading: 'Warp’s keeper network examines the job queue',
  },
  {
    text: 'If all job conditions have been met, the first keeper to execute the job earns the reward',
    label: '03',
    heading: 'A keeper executes the job',
  },
];

const AnimatedDisplay: React.FC<Props> = ({ className }) => {
  const [currentTick, setCurrentTick] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startInterval = () => {
    intervalRef.current = setInterval(() => {
      setCurrentTick((prev) => (prev + 1) % texts.length);
    }, 5000);
  };

  useEffect(() => {
    startInterval();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleSetCurrentTick: React.Dispatch<React.SetStateAction<number>> = (
    action
  ) => {
    setCurrentTick(action);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    startInterval();
  };

  return (
    <div className={classNames(styles.container, className)}>
      <AnimatedText {...texts[currentTick]} />
      <WaveSlider
        currentTick={currentTick}
        setCurrentTick={handleSetCurrentTick}
      />
    </div>
  );
};

export default AnimatedDisplay;
