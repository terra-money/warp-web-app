import { formatAmount } from '@terra-money/apps/libs/formatting';
import { AnimateNumber } from 'components/animate-number';
import { Container, UIElementProps } from '@terra-money/apps/components';
import { useAnalyticsData } from './useAnalyticsData';
import classNames from 'classnames';
import Big from 'big.js';
import { ChartContainer } from 'components/chart-container';
import styles from './RewardStatistics.module.sass';

export const RewardStatistics = (props: UIElementProps) => {
  const { className } = props;

  const { isLoading, values, total } = useAnalyticsData('reward_amount', 'monthly', 1000000, false);

  const average = values.length === 0 ? 0 : Big(total).div(values.length);

  return (
    <Container className={classNames(styles.root, className)} direction="column">
      <ChartContainer
        isLoading={isLoading}
        title="Total rewards claimed"
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
            <sub>&nbsp;WARP</sub>
          </>
        }
      />
      <ChartContainer
        isLoading={isLoading}
        title="Average rewards claimed per month"
        subtitle={
          <>
            <AnimateNumber
              format={(v) =>
                formatAmount(v, {
                  decimals: 2,
                })
              }
            >
              {average}
            </AnimateNumber>
            <sub>&nbsp;WARP</sub>
          </>
        }
      />
    </Container>
  );
};
