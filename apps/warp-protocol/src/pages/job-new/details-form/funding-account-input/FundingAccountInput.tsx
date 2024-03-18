import { Container, UIElementProps } from '@terra-money/apps/components';
import classNames from 'classnames';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { FormControl } from 'components/form-control/FormControl';
import styles from './FundingAccountInput.module.sass';
import { useFundingAccountListDialog } from './funding-account-list';
import { truncateAddress } from '@terra-money/apps/utils';

interface FundingAccountInputProps extends UIElementProps {
  label: string;
  placeholder?: string;
  value?: string;
  optional?: boolean;
  onChange: (value: string) => void;
}

const FundingAccountInput = (props: FundingAccountInputProps) => {
  const { className, placeholder = 'Select a funding account', label, value, onChange, optional } = props;

  const openFundingAccountList = useFundingAccountListDialog();

  const component =
    value === undefined ? (
      <span className={styles.placeholder}>{placeholder}</span>
    ) : (
      <span className={styles.text}>{truncateAddress(value, [8, 6])}</span>
    );

  return (
    <FormControl className={classNames(className, styles.root)} label={label} optional={optional}>
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
