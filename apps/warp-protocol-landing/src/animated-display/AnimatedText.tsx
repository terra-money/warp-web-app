import React, { useEffect, useState } from 'react';
import styles from './AnimatedText.module.sass';

export interface AnimatedTextProps {
  text: string;
  label: string;
  heading: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  heading,
  label,
}) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(false);
    setTimeout(() => setAnimate(true), 50);
  }, [text]);

  return (
    <div className={`${styles.container} ${animate ? styles.animate : styles.not_animated}`}>
      <div className={styles.label}>{label}</div>
      <div className={styles.heading}>{heading}</div>
      <div className={styles.text}>{text}</div>
    </div>
  );
};

export default AnimatedText;
