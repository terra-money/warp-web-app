import { formatAmount, demicrofy } from '@terra-money/apps/libs/formatting';
import { u } from '@terra-money/apps/types';
import Big from 'big.js';
import classNames from 'classnames';
import { Text } from 'components/primitives';

interface TokenBalanceProps {
  className: string;
  balance: u<Big>;
  decimals: number;
}

export const TokenBalance = (props: TokenBalanceProps) => {
  const { className, balance, decimals } = props;

  const formattedAmount =
    balance === undefined || balance.lte(0)
      ? ''
      : formatAmount(demicrofy(balance, decimals), {
          decimals: 2,
        });

  return (
    <Text className={classNames(className)} variant="text">
      {formattedAmount}
    </Text>
  );
};
