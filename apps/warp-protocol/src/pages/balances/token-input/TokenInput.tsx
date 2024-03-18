import { Container, UIElementProps } from '@terra-money/apps/components';
import classNames from 'classnames';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { FormControl } from 'components/form-control/FormControl';
import { TokenIcon } from 'components/token-icon';
import { Token } from '@terra-money/apps/types';
import { useTokenListDialog } from 'components/token-list';
import styles from './TokenInput.module.sass';

interface TokenInputProps extends UIElementProps {
  label: string;
  placeholder?: string;
  optional?: boolean;
  value?: Token;
  onChange: (value: Token) => void;
}

const TokenInput = (props: TokenInputProps) => {
  const { className, placeholder = 'Select a token', label, value, onChange, optional } = props;

  const openTokenList = useTokenListDialog();

  const component =
    value === undefined ? (
      <span className={styles.placeholder}>{placeholder}</span>
    ) : typeof value === 'string' ? (
      <span className={styles.text}>{value}</span>
    ) : (
      <>
        <TokenIcon className={styles.icon} symbol={value.icon} path={value.icon} />
        <span className={styles.text}>{value.name ?? value.symbol}</span>
      </>
    );

  return (
    <FormControl className={classNames(className, styles.root)} label={label} optional={optional}>
      <Container
        className={styles.container}
        direction="row"
        onClick={() =>
          openTokenList().then((token) => {
            token && onChange(token);
          })
        }
      >
        {component}
        <KeyboardArrowDownIcon className={styles.chevron} />
      </Container>
    </FormControl>
  );
};

export { TokenInput };
