import { Container, UIElementProps } from '@terra-money/apps/components';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import styles from './MethodInput.module.sass';
import classNames from 'classnames';
import { MenuAction } from 'components/menu-button/MenuAction';
import { DropdownMenu } from 'components/dropdown-menu/DropdownMenu';
import { FormControl } from 'components/form-control/FormControl';
import { useInterval } from 'usehooks-ts';
import { useRef, useState } from 'react';

interface MethodInputProps<T> extends UIElementProps {
  placeholder?: string;
  menuClass?: string;
  label?: string;
  value?: T;
  methods: T[];
  onChange: (value: T) => void;
}

function MethodInput<T extends string>(props: MethodInputProps<T>) {
  const { placeholder = 'Method', value, onChange, methods, menuClass, className, label = 'Method' } = props;

  const component =
    value === undefined ? (
      <span className={styles.placeholder}>{placeholder}</span>
    ) : (
      <span className={styles.text}>{value}</span>
    );

  const parentRef = useRef<HTMLDivElement>();

  const [menuWidth, setMenuWidth] = useState<number>(0);

  useInterval(() => {
    setMenuWidth(parentRef.current?.getBoundingClientRect().width ?? 0);
  }, 200);

  return (
    <FormControl className={classNames(className, styles.root)} label={label} ref={parentRef}>
      <DropdownMenu
        menuStyle={{ width: menuWidth }}
        menuClass={classNames(styles.menu, menuClass)}
        action={
          <Container className={styles.container} direction="row">
            {component}
            <KeyboardArrowDownIcon className={styles.chevron} />
          </Container>
        }
      >
        {methods.map((v, idx) => (
          <MenuAction key={idx} onClick={() => onChange(v)}>
            {v}
          </MenuAction>
        ))}
      </DropdownMenu>
    </FormControl>
  );
}

export { MethodInput };
