import { demicrofy, formatAmount } from '@terra-money/apps/libs/formatting';
import { ChartContainer } from 'components/chart-container';
import { AnimateNumber } from 'components/animate-number';
import { UIElementProps } from '@terra-money/apps/components';
import { BarChart } from 'components/bar-chat';
import { useAnalyticsData } from './useAnalyticsData';
import styles from './DailyRewardsChart.module.sass';
import { u } from '@terra-money/apps/types';
import Big from 'big.js';
import { useNativeToken } from 'hooks/useNativeToken';

export const DailyRewardsChart = (props: UIElementProps) => {
  const { className } = props;

  const { isLoading, total, values, labels } = useAnalyticsData('reward_amount');

  const nativeToken = useNativeToken();

  return (
    <ChartContainer
      className={className}
      isLoading={isLoading}
      title="Rewards claimed (last 7 days)"
      subtitle={
        <>
          <AnimateNumber
            format={(v) =>
              formatAmount(demicrofy(v as u<Big>, nativeToken.decimals), {
                decimals: 1,
              })
            }
          >
            {total}
          </AnimateNumber>
          <sub>&nbsp;{nativeToken.symbol}</sub>
        </>
      }
    >
      <BarChart className={styles.chart} data={values} labels={labels} />
    </ChartContainer>
  );
};
