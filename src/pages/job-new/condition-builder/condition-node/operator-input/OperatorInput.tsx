import { Container, UIElementProps } from 'shared/components';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import styles from './OperatorInput.module.sass';
import classNames from 'classnames';
import { MenuAction } from 'components/menu-button/MenuAction';
import { DropdownMenu } from 'components/dropdown-menu/DropdownMenu';

interface OperatorInputProps<T> extends UIElementProps {
  placeholder?: string;
  menuClass?: string;
  value?: T;
  operators: T[];
  onChange: (value: T) => void;
}

function OperatorInput<T extends string>(props: OperatorInputProps<T>) {
  const { placeholder = 'Operator', value, onChange, operators, menuClass, className } = props;

  const component =
    value === undefined ? (
      <span className={styles.placeholder}>{placeholder}</span>
    ) : (
      <span className={styles.text}>{value}</span>
    );

  return (
    <DropdownMenu
      className={className}
      menuClass={classNames(styles.menu, menuClass)}
      action={
        <Container className={styles.container} direction="row">
          {component}
          <KeyboardArrowDownIcon className={styles.chevron} />
        </Container>
      }
    >
      {operators.map((v, idx) => (
        <MenuAction key={idx} onClick={() => onChange(v)}>
          {v}
        </MenuAction>
      ))}
    </DropdownMenu>
  );
}

export { OperatorInput };
