import luna from 'components/assets/Luna.svg';
import classNames from 'classnames';
import { UIElementProps } from '@terra-money/apps/components';
import { Token } from 'types/types';
import { ReactComponent as WarpTokenIcon } from 'components/assets/WarpToken.svg';
import styles from './AnimatedTokenIcon.module.sass';

const KNOWN_TOKENS: Record<string, string> = {
  luna,
};

interface AnimatedTokenIconProps extends UIElementProps {
  token: Token;
  active: boolean;
}

export const AnimatedTokenIcon = (props: AnimatedTokenIconProps) => {
  const { className, token } = props;

  let src =
    token.symbol && KNOWN_TOKENS[token.symbol.toLowerCase()] ? KNOWN_TOKENS[token.symbol.toLowerCase()] : token.icon;

  src = src && src.length > 0 ? src : 'https://assets.terra.money/icon/svg/CW.svg';

  // TODO: remove once warp token icon is uploaded to terra assets
  if (token.symbol === 'WARP') {
    return (
      <div className={classNames(className, styles.root)}>
        <WarpTokenIcon className={styles.back} />
      </div>
    );
  }

  return (
    <div className={classNames(className, styles.root)}>
      {/* <img className={styles.front} alt="" src={src} /> */}
      <img className={styles.back} alt="" src={src} />
    </div>
  );
};
