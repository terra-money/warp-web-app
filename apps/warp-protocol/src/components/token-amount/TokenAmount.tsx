import { Token } from '@terra-money/apps/types';
import { Text, TextProps, Throbber } from 'components/primitives';
import Big, { BigSource } from 'big.js';
import { demicrofy, formatAmount } from '@terra-money/apps/libs/formatting';
import { u } from '@terra-money/apps/types';
import classNames from 'classnames';
import { TokenIcon } from 'components/token-icon';
import { Container } from '@terra-money/apps/components';
import { usePrice } from '@terra-money/apps/hooks';
import styles from './TokenAmount.module.sass';

interface TokenAmountProps extends Pick<TextProps, 'variant' | 'component'> {
  className?: string;
  token: Token;
  amount: u<BigSource>;
  decimals?: number;
  showSymbol?: boolean;
  showIcon?: boolean;
  loading?: boolean;
  showUsdAmount?: boolean;
}

export const TokenAmount = (props: TokenAmountProps) => {
  const {
    className,
    variant,
    component,
    token,
    amount,
    decimals,
    loading = false,
    showSymbol = true,
    showIcon = false,
    showUsdAmount = false,
  } = props;

  const formattingOptions = {
    decimals: decimals ?? token.decimals ?? 2,
  };

  const formattedAmount = formatAmount(demicrofy(amount, token.decimals ?? 6), formattingOptions);

  const priceUsd = usePrice(token);

  const formattedUsdAmount = formatAmount(priceUsd ? demicrofy(amount, token.decimals ?? 6).mul(priceUsd) : Big(0), {
    decimals: 2,
  });

  if (loading) {
    return (
      <Container className={styles.container} direction="row">
        <Throbber className={styles.throbber} size="small" />
      </Container>
    );
  }

  return (
    <Container className={styles.container} direction="row">
      <Text className={classNames(className, styles.root)} variant={variant} component={component}>
        {formattedAmount}
        {showIcon === false && showSymbol && token.symbol && <sub>{token.symbol}</sub>}
        {showIcon && token && (
          <TokenIcon className={styles.icon} variant="inset" symbol={token.symbol} path={token.icon} />
        )}
      </Text>
      {showUsdAmount && (
        <Text variant="label" className={styles.usd_amount}>
          (${formattedUsdAmount})
        </Text>
      )}
    </Container>
  );
};
