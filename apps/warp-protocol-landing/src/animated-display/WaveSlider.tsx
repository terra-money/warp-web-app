import React from 'react';
import styles from './WaveSlider.module.sass';
import { ReactComponent as TickIcon } from '../assets/Tick.svg';

interface Props {
  currentTick: number;
  setCurrentTick: React.Dispatch<React.SetStateAction<number>>;
}

const WaveSlider: React.FC<Props> = ({ currentTick, setCurrentTick }) => {
  const tickPosition = 24 * currentTick; // width + margin of each bar

  return (
    <div className={styles.slider}>
      {Array(9)
        .fill(0)
        .map((_, idx) => (
          <div
            onClick={() => {
              if (idx <= 2) {
                setCurrentTick(idx);
              }
            }}
            key={idx}
            className={`${styles.tick} ${
              idx === currentTick ? styles.active : ''
            } ${idx > 2 ? styles.disabled : ''}`}
          ></div>
        ))}
      <TickIcon className={styles.tickIcon} style={{ left: tickPosition }} />
    </div>
  );
};

export default WaveSlider;
