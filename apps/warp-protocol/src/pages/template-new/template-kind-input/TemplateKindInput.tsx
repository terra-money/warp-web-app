import { Container, UIElementProps } from '@terra-money/apps/components';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import styles from './TemplateKindInput.module.sass';
import classNames from 'classnames';
import { MenuAction } from 'components/menu-button/MenuAction';
import { FormControl } from 'components/form-control/FormControl';
import { DropdownMenu } from 'components/dropdown-menu/DropdownMenu';
import { useRef, useState } from 'react';
import { useInterval } from 'usehooks-ts';
import { warp_controller } from 'types';

type TemplateKindInputProps = UIElementProps & {
  value?: warp_controller.TemplateKind | null;
  label: string;
  options: warp_controller.TemplateKind[];
  placeholder: string;
  onChange: (value: warp_controller.TemplateKind | undefined) => void;
};

const renderValue = (value?: warp_controller.TemplateKind) => {
  if (value === 'msg') {
    return 'job';
  }

  return value;
};

export function TemplateKindInput(props: TemplateKindInputProps) {
  const { value, onChange, placeholder, className, options, label } = props;

  const component = !value ? (
    <span className={styles.placeholder}>{placeholder}</span>
  ) : (
    <span className={styles.text}>{renderValue(value)}</span>
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
        menuClass={styles.menu}
        action={
          <Container className={styles.input} direction="row">
            {component}
            <KeyboardArrowDownIcon className={styles.chevron} />
          </Container>
        }
      >
        {options.map((option) => (
          <MenuAction key={option} onClick={() => onChange(option)}>
            {renderValue(option)}
          </MenuAction>
        ))}
      </DropdownMenu>
    </FormControl>
  );
}
