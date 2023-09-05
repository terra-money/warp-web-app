import React from 'react';
import classnames from 'classnames';
import styles from './Frame.module.sass';
import classNames from 'classnames';

interface EllipseWithTextProps {
  text: string;
}

const EllipseWithText: React.FC<EllipseWithTextProps> = ({ text }) => (
  <div className={styles.flexRow}>
    <div className={styles.ellipseWrapper}>
      <div className={styles.ellipse} />
    </div>
    <div className={`${styles.ellipseText} ${styles.text} ${styles.textYellow}`}>{text}</div>
  </div>
);

interface TextRowProps {
  label: string;
  value: string;
}

const TextRow: React.FC<TextRowProps> = ({ label, value }) => (
  <div className={styles.flexRow}>
    <div className={`${styles.text} ${styles.textGray}`}>{label}</div>
    <div className={`${styles.paddedText} ${styles.text} ${styles.textWhite}`}>{value}</div>
  </div>
);

interface FrameProps {
  ellipseText: string;
  viewers: string;
  jobName: string;
  jobStatus: string;
  rewardValue: string;
  latestBidValue: string;
}

const Frame: React.FC<FrameProps> = ({
  ellipseText,
  viewers,
  jobName,
  jobStatus,
  rewardValue,
  latestBidValue,
}) => (
  <div className={styles.frame}>
    <div className={styles.flexRow}>
      <EllipseWithText text={ellipseText} />
      <div className={`${styles.text} ${styles.textGray}`}>{viewers}</div>
    </div>
    <div className={styles.flexColumn}>
      <div className={`${styles.text} ${styles.textLarge}`}>{jobName}</div>
      <div className={`${styles.text} ${styles.textGray}`}>{jobStatus}</div>
    </div>
    <div className={styles.flexRow}>
      <TextRow label="Reward:" value={rewardValue} />
      <TextRow label="Latest bid:" value={latestBidValue} />
    </div>
  </div>
);

export default Frame;
