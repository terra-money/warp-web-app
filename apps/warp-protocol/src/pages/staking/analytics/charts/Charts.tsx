import { useMemo } from 'react';
import { Carousel } from './Carousel';
import { StakingStatistics } from './StakingStatistics';
import styles from './Charts.module.sass';
import { WarpTokenAPR } from './WarpTokenAPR';
import { WarpAstroLPTokenAPR } from './WarpAstroLPTokenAPR';

export const Charts = () => {
  const components = useMemo(() => {
    return [
      <StakingStatistics key="jobs-statistics" className={styles.chart} />,
      <WarpTokenAPR className={styles.chart} />,
      <WarpAstroLPTokenAPR />,
    ];
  }, []);

  return <Carousel>{components}</Carousel>;
};
