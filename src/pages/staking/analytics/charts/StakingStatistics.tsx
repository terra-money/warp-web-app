import { formatAmount } from 'shared/libs/formatting';
import { ChartContainer } from 'components/chart-container';
import { AnimateNumber } from 'components/animate-number';
import { Container, UIElementProps } from 'shared/components';
import classNames from 'classnames';
import Big from 'big.js';
import styles from './StakingStatistics.module.sass';
import { Text } from 'components/primitives';
import { useStakingQuery } from '../../../../queries/useStakingQuery';
import { useWarpPrice } from '../../../../queries/useWarpPrice';
import { CircularProgress } from 'components/circular-progress/CircularProgress';

export const StakingStatistics = (props: UIElementProps) => {
  const { className } = props;

  const price = useWarpPrice();
  const { data, isLoading } = useStakingQuery({ token: 'warp' });

  const amountStaked = data?.amountStaked || 0;

  const millionsStaked = new Big(amountStaked).div(1000000).toFixed(2);
  const percentStaked = (data?.percentageStaked || 0) * 100;

  return (
    <Container className={classNames(styles.root, className)} direction="column">
      <ChartContainer
        isLoading={isLoading}
        title="WARP Price"
        className={styles.chart_container}
        subtitle={
          <Container direction={'row'} gap={8}>
            <AnimateNumber
              format={(v) =>
                formatAmount(v, {
                  decimals: 2,
                })
              }
              className={styles.stat_number}
            >
              {price}
            </AnimateNumber>
            <Text variant={'heading1'} className={styles.currency}>
              USDC
            </Text>
          </Container>
        }
      />
      <ChartContainer
        isLoading={isLoading}
        className={styles.chart_container}
        title="Total staked WARP"
        subtitle={
          <Container direction={'row'} gap={4}>
            <Text variant={'heading1'}>
              <AnimateNumber
                format={(v) =>
                  formatAmount(v, {
                    decimals: 2,
                  })
                }
              >
                {millionsStaked}
              </AnimateNumber>
              M
            </Text>
            <Text variant={'text'} className={styles.percentage_staked}>
              {percentStaked}%
            </Text>
          </Container>
        }
      >
        <CircularProgress
          thickness={4}
          size={64}
          variant="determinate"
          value={percentStaked}
          className={styles.circular_progress}
          ContainerProps={{
            className: styles.circular_progress_container,
          }}
        />
      </ChartContainer>
    </Container>
  );
};
