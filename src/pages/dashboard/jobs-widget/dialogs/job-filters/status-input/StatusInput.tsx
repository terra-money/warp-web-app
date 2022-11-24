import { Container, UIElementProps } from 'shared/components';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { ReactComponent as CloseIcon } from 'components/assets/Close.svg';
import styles from './StatusInput.module.sass';
import classNames from 'classnames';
import { MenuAction } from 'components/menu-button/MenuAction';
import { FormControl } from 'components/form-control/FormControl';
import { DropdownMenu } from 'components/dropdown-menu/DropdownMenu';

type StatusInputProps<T> = UIElementProps & {
  value?: T | null;
  label: string;
  options: T[];
  disableClear?: boolean;
  placeholder: string;
  onChange: (value: T | undefined) => void;
};

export function StatusInput<T extends string>(props: StatusInputProps<T>) {
  const { value, onChange, placeholder, className, options, label, disableClear } = props;

  const component = !value ? (
    <span className={styles.placeholder}>{placeholder}</span>
  ) : (
    <span className={styles.text}>
      {value}
      {!disableClear && (
        <CloseIcon
          className={styles.close}
          onClick={(e) => {
            onChange(undefined);
            e.stopPropagation();
          }}
        />
      )}
    </span>
  );

  return (
    <FormControl className={classNames(className, styles.root)} label={label}>
      <DropdownMenu
        menuClass={styles.menu}
        action={
          <Container className={styles.status_input} direction="row">
            {component}
            <KeyboardArrowDownIcon className={styles.chevron} />
          </Container>
        }
      >
        {/* <MenuAction key="clear" className={styles.clear_option} onClick={() => onChange(undefined)}>
          Clear filter
        </MenuAction> */}
        {options.map((option) => (
          <MenuAction key={option} onClick={() => onChange(option)}>
            {option}
          </MenuAction>
        ))}
      </DropdownMenu>
    </FormControl>
  );
}
