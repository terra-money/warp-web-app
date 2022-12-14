import { Container, UIElementProps } from '@terra-money/apps/components';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import styles from './TemplatesInput.module.sass';
import classNames from 'classnames';
import { MenuAction } from 'components/menu-button/MenuAction';
import { FormControl } from 'components/form-control/FormControl';
import { DropdownMenu } from 'components/dropdown-menu/DropdownMenu';
import { Template } from 'pages/templates/useTemplateStorage';

type TemplatesInputProps = UIElementProps & {
  value?: Template | null;
  label: string;
  options: Template[];
  placeholder: string;
  onChange: (value: Template | undefined) => void;
};

export function TemplatesInput(props: TemplatesInputProps) {
  const { value, onChange, placeholder, className, options, label } = props;

  const component = !value ? (
    <span className={styles.placeholder}>{placeholder}</span>
  ) : (
    <span className={styles.text}>{value.name}</span>
  );

  return (
    <FormControl className={classNames(className, styles.root)} label={label}>
      <DropdownMenu
        menuClass={styles.menu}
        action={
          <Container className={styles.input} direction="row">
            {component}
            <KeyboardArrowDownIcon className={styles.chevron} />
          </Container>
        }
      >
        {options.map((option) => (
          <MenuAction key={option.name} onClick={() => onChange(option)}>
            {option.name}
          </MenuAction>
        ))}
      </DropdownMenu>
    </FormControl>
  );
}
