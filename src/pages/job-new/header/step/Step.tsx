import { Container, UIElementProps } from 'shared/components';
import classNames from 'classnames';
import { Text } from 'components/primitives';
import { ReactComponent as Circle } from 'components/assets/Circle.svg';
import { ReactComponent as CirclePoint } from 'components/assets/CirclePoint.svg';
import { ReactComponent as Check } from 'components/assets/Check.svg';

import styles from './Step.module.sass';

export type StepProps = UIElementProps & {
  selected?: boolean;
  valid?: boolean;
  step: number;
  label: string;
};

export const Step = (props: StepProps) => {
  const { selected, label, step, className, valid } = props;

  return (
    <Container
      direction="row"
      className={classNames(styles.step, className, selected && styles.step_selected, valid && styles.step_valid)}
    >
      {selected ? (
        <CirclePoint className={styles.step_icon} />
      ) : valid ? (
        <Check className={styles.step_icon} />
      ) : (
        <Circle className={styles.step_icon} />
      )}
      <Container direction="column">
        <Text variant="label" className={styles.step_label}>
          Step {step}
        </Text>
        <Text variant="text" className={styles.step_text}>
          {label}
        </Text>
      </Container>
    </Container>
  );
};
