import React, { useEffect, useState } from 'react';
import AnimatedText, { AnimatedTextProps } from './AnimatedText';
import styles from './AnimatedDisplay.module.sass';
import WaveSlider from './WaveSlider';
import classNames from 'classnames';
import { UIElementProps } from '@terra-money/apps/components';

interface Props extends UIElementProps {}

const texts: AnimatedTextProps[] = [
  {
    text: 'A developer, or one of their users, through their platform’s UI, specifies what they want their job to do, the conditions under which it will execute, and the reward.',
    label: '01',
    heading: 'A job is created and sent to the Warp job queue',
  },
  {
    text: 'Warp’s decentralized network of keeper bots compete and check to see if all of the job conditions have been satisfied',
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTick((prev) => (prev + 1) % 3);
    }, 3000);

    return () => clearInterval(interval);
  }, [setCurrentTick]);

  return (
    <div className={classNames(styles.container, className)}>
      <AnimatedText {...texts[currentTick]} />
      <WaveSlider currentTick={currentTick} setCurrentTick={setCurrentTick} />
    </div>
  );
};

export default AnimatedDisplay;
