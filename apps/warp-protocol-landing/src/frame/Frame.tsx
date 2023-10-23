import React from 'react';
import styles from './Frame.module.sass';
import { format } from 'date-fns';
import { ReactComponent as CheckIcon } from '../assets/Check.svg';

interface EllipseWithTextProps {
  text: string;
}

const EllipseWithText: React.FC<EllipseWithTextProps> = ({ text }) => (
  <div className={styles.flexRow}>
    <div className={styles.ellipseWrapper}>
      <div className={styles.ellipse} />
    </div>
    <div
      className={`${styles.ellipseText} ${styles.text} ${styles.textYellow}`}
    >
      {text}
    </div>
  </div>
);

interface TextRowProps {
  label: string;
  value: string;
}

const TextRow: React.FC<TextRowProps> = ({ label, value }) => (
  <div className={styles.flexRow}>
    <div className={`${styles.text} ${styles.textGray}`}>{label}</div>
    <div className={`${styles.paddedText} ${styles.text} ${styles.textWhite}`}>
      {value}
    </div>
  </div>
);

interface FrameProps {
  ellipseText: string;
  viewers: string;
  jobName: string;
  jobStatus: string;
  rewardValue: string;
  latestBidValue: string;
  isExecuted: boolean;
}

const Frame: React.FC<FrameProps> = ({
  ellipseText,
  viewers,
  jobName,
  jobStatus,
  rewardValue,
  isExecuted,
}) => (
  <div className={styles.frame}>
    <div className={styles.flexRow}>
      {isExecuted ? (
        <div className={styles.flexRow}>
          <div className={styles.checkWrapper}>
            <CheckIcon className={styles.check} />
          </div>
          <div
            className={`${styles.ellipseText} ${styles.text}`}
          >
            Executed
          </div>
        </div>
      ) : (
        <EllipseWithText text={ellipseText} />
      )}
      <div className={`${styles.text} ${styles.textGray}`}>{viewers}</div>
    </div>
    <div className={styles.flexColumn}>
      <div className={`${styles.text} ${styles.textLarge}`}>{jobName}</div>
      <div className={`${styles.text} ${styles.textGray}`}>
        {isExecuted
          ? `Executed at: ${format(new Date(), 'dd MMM yyyy p')}`
          : jobStatus}
      </div>
    </div>
    <div className={styles.flexRow}>
      <TextRow label="Reward:" value={rewardValue} />
    </div>
  </div>
);

export default Frame;
