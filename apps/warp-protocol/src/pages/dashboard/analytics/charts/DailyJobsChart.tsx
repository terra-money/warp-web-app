import { formatAmount } from '@terra-money/apps/libs/formatting';
import { AnimateNumber } from 'components/animate-number';
import { UIElementProps } from '@terra-money/apps/components';
import { BarChart } from 'components/bar-chat';
import { useAnalyticsData } from './useAnalyticsData';
import styles from './DailyJobsChart.module.sass';
import { ChartContainer } from 'components/chart-container';

export const DailyJobsChart = (props: UIElementProps) => {
  const { className } = props;

  const { isLoading, total, values, labels } = useAnalyticsData('create_job_count');

  return (
    <ChartContainer
      className={className}
      isLoading={isLoading}
      title="Jobs created (last 7 days)"
      subtitle={
        <AnimateNumber
          format={(v) =>
            formatAmount(v, {
              decimals: 0,
            })
          }
        >
          {total}
        </AnimateNumber>
      }
    >
      <BarChart className={styles.chart} data={values} labels={labels} />
    </ChartContainer>
  );
};
