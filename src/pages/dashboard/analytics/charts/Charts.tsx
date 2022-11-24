import { useMemo } from 'react';
import { Carousel } from './Carousel';
import { DailyJobsChart } from './DailyJobsChart';
import { DailyRewardsChart } from './DailyRewardsChart';
import { JobsStatistics } from './JobStatistics';
import { RewardStatistics } from './RewardStatistics';
import styles from './Charts.module.sass';

export const Charts = () => {
  const components = useMemo(() => {
    return [
      <JobsStatistics key="jobs-statistics" className={styles.chart} />,
      <DailyJobsChart key="daily-jobs" className={styles.chart} />,
      <RewardStatistics key="reward-statistics" className={styles.chart} />,
      <DailyRewardsChart key="daily-rewards" className={styles.chart} />,
    ];
  }, []);

  return <Carousel>{components}</Carousel>;
};
