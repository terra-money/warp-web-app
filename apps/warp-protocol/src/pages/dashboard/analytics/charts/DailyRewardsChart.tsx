import { formatAmount } from '@terra-money/apps/libs/formatting';
import { ChartContainer } from 'components/chart-container';
import { AnimateNumber } from 'components/animate-number';
import { UIElementProps } from '@terra-money/apps/components';
import { BarChart } from 'components/bar-chat';
import { useAnalyticsData } from './useAnalyticsData';
import styles from './DailyRewardsChart.module.sass';

export const DailyRewardsChart = (props: UIElementProps) => {
  const { className } = props;

  const { isLoading, total, values, labels } = useAnalyticsData('reward_amount');

  return (
    <ChartContainer
      className={className}
      isLoading={isLoading}
      title="Rewards claimed (last 7 days)"
      subtitle={
        <>
          <AnimateNumber
            format={(v) =>
              formatAmount(v, {
                decimals: 2,
              })
            }
          >
            {total}
          </AnimateNumber>
          <sub>&nbsp;LUNA</sub>
        </>
      }
    >
      <BarChart className={styles.chart} data={values} labels={labels} />
    </ChartContainer>
  );
};
