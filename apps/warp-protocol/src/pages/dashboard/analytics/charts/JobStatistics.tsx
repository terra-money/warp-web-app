import { formatAmount } from '@terra-money/apps/libs/formatting';
import { AnimateNumber } from 'components/animate-number';
import { Container, UIElementProps } from '@terra-money/apps/components';
import { useAnalyticsData } from './useAnalyticsData';
import classNames from 'classnames';
import Big from 'big.js';
import styles from './JobStatistics.module.sass';
import { ChartContainer } from 'components/chart-container';
import { useMemo } from 'react';
import { useChainSelector } from '@terra-money/apps/hooks';

const JOB_COUNT_OFFSET = 4823;

export const JobsStatistics = (props: UIElementProps) => {
  const { className } = props;

  const { isLoading, values, total } = useAnalyticsData('create_job_count', 'monthly', 1000000, false);

  const average = values.length === 0 ? 0 : Big(total).div(values.length);

  const { selectedChain } = useChainSelector();

  const jobCountOffset = useMemo(() => {
    if (selectedChain.name === 'terra') {
      return JOB_COUNT_OFFSET;
    }

    return 0;
  }, [selectedChain]);

  return (
    <Container className={classNames(styles.root, className)} direction="column">
      <ChartContainer
        isLoading={isLoading}
        title="Total jobs created"
        subtitle={
          <AnimateNumber
            format={(v) =>
              formatAmount(v, {
                decimals: 0,
              })
            }
          >
            {total.add(jobCountOffset)}
          </AnimateNumber>
        }
      />
      <ChartContainer
        isLoading={isLoading}
        title="Average jobs per month"
        subtitle={
          <AnimateNumber
            format={(v) =>
              formatAmount(v, {
                decimals: 1,
              })
            }
          >
            {average}
          </AnimateNumber>
        }
      />
    </Container>
  );
};
