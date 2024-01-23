import { Container, UIElementProps } from '@terra-money/apps/components';
import classNames from 'classnames';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { FormControl } from 'components/form-control/FormControl';
import { TokenIcon } from 'components/token-icon';
import { Token } from '@terra-money/apps/types';
import styles from './FundingAccountInput.module.sass';
import { useFundingAccountListDialog } from './funding-account-list';

interface FundingAccountInputProps extends UIElementProps {
  label: string;
  placeholder?: string;
  value?: Token;
  onChange: (value: string) => void;
}

const FundingAccountInput = (props: FundingAccountInputProps) => {
  const { className, placeholder = 'Select a funding account', label, value, onChange } = props;

  const openFundingAccountList = useFundingAccountListDialog();

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
    <FormControl className={classNames(className, styles.root)} label={label}>
      <Container
        className={styles.container}
        direction="row"
        onClick={() =>
          openFundingAccountList().then((fundingAccount) => {
            fundingAccount && onChange(fundingAccount);
          })
        }
      >
        {component}
        <KeyboardArrowDownIcon className={styles.chevron} />
      </Container>
    </FormControl>
  );
};

export { FundingAccountInput };
