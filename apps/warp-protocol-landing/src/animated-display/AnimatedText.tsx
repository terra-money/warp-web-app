import React from 'react';
import styles from './AnimatedText.module.sass';

export interface AnimatedTextProps {
  text: string;
  label: string;
  heading: string;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text, heading, label }) => {
  return (
    <div className={styles.container}>
      <div className={styles.label}>{label}</div>
      <div className={styles.heading}>{heading}</div>
      <div className={styles.text}>{text}</div>
    </div>
  );
};

export default AnimatedText;
