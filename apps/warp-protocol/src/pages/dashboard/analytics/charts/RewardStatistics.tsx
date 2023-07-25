import { demicrofy, formatAmount } from '@terra-money/apps/libs/formatting';
import { AnimateNumber } from 'components/animate-number';
import { Container, UIElementProps } from '@terra-money/apps/components';
import { useAnalyticsData } from './useAnalyticsData';
import classNames from 'classnames';
import Big from 'big.js';
import { ChartContainer } from 'components/chart-container';
import styles from './RewardStatistics.module.sass';
import { u } from '@terra-money/apps/types';
import { useNativeToken } from 'hooks/useNativeToken';
import { useChainSelector } from '@terra-money/apps/hooks';
import { SmallPlaceholder } from '../placeholders/SmallPlaceholder';

export const RewardStatistics = (props: UIElementProps) => {
  const { className } = props;

  const { isLoading, values, total } = useAnalyticsData('reward_amount', 'monthly', 1000000, false);

  const average = values.length === 0 ? 0 : Big(total).div(values.length);

  const nativeToken = useNativeToken();

  const { selectedChain } = useChainSelector();

  if (selectedChain.name === 'injective') {
    return (
      <Container className={classNames(styles.root, className)} direction="column">
        <SmallPlaceholder />
        <SmallPlaceholder />
      </Container>
    );
  }

  return (
    <Container className={classNames(styles.root, className)} direction="column">
      <ChartContainer
        isLoading={isLoading}
        title="Total rewards claimed"
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
      />
      <ChartContainer
        isLoading={isLoading}
        title="Average rewards claimed per month"
        subtitle={
          <>
            <AnimateNumber
              format={(v) =>
                formatAmount(demicrofy(v as u<Big>, nativeToken.decimals), {
                  decimals: 1,
                })
              }
            >
              {average}
            </AnimateNumber>
            <sub>&nbsp;{nativeToken.symbol}</sub>
          </>
        }
      />
    </Container>
  );
};
