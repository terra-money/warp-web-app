import classNames from 'classnames';
import { FormControl } from 'components/form-control/FormControl';
import { Switch } from 'components/primitives/switch';
import { Text } from 'components/primitives';
import styles from './ToggleInput.module.sass';
import { Container } from '@terra-money/apps/components';

interface ToggleInputProps {
  className?: string;
  label: string;
  helpText: string;
  value?: boolean;
  onChange: (value?: boolean) => void;
}

const ToggleInput = (props: ToggleInputProps) => {
  const { className, label, helpText, value, onChange } = props;

  return (
    <FormControl className={classNames(className, styles.root)} label={label} labelGap={false} helpText={helpText}>
      <Container className={styles.inner}>
        <Switch
          className={styles.switch}
          size="small"
          value={value ? 'on' : 'off'}
          checked={value}
          onChange={(event) => onChange(event.target.checked)}
        />
        <Text variant="text" className={classNames(value && styles.yes_text, !value && styles.no_text)}>
          {value ? 'Yes' : 'No'}
        </Text>
      </Container>
    </FormControl>
  );
};

export { ToggleInput };
