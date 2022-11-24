import { Button, Text } from 'components/primitives';
import { ListChildComponentProps } from 'react-window';
import { TokenIcon } from 'components/token-icon';
import { ReactComponent as PlusIcon } from 'components/assets/Plus.svg';
import { ReactComponent as CheckIcon } from 'components/assets/Check.svg';
import { ListData } from './ListData';
import styles from './ListItem.module.sass';

export const ListItem = (props: ListChildComponentProps<ListData>) => {
  const {
    index,
    style,
    data: { tokens, onSelectToken, onDeselectToken, isTokenSelected },
  } = props;

  const token = tokens[index];

  return (
    <div key={token.symbol} className={styles.listItem} style={style}>
      <TokenIcon className={styles.icon} symbol={token.symbol} path={token.icon} />
      <Text className={styles.symbol} variant="text" weight="bold">
        {token.symbol}
      </Text>
      <Text className={styles.name} variant="label">
        {token.name}
      </Text>
      {isTokenSelected(token) ? (
        <Button
          iconGap="none"
          className={styles.btn}
          icon={<CheckIcon className={styles.check_icon} />}
          variant="primary"
          onClick={() => onDeselectToken(token)}
        />
      ) : (
        <Button
          iconGap="none"
          className={styles.btn}
          icon={<PlusIcon className={styles.plus_icon} />}
          variant="secondary"
          onClick={() => onSelectToken(token)}
        />
      )}
    </div>
  );
};
