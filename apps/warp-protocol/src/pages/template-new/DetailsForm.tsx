import { Container, UIElementProps } from '@terra-money/apps/components';
import classNames from 'classnames';
import { FormControl } from 'components/form-control/FormControl';
import { Form } from 'components/form/Form';
import { TextInput } from 'components/primitives/text-input';
import styles from './TemplateNew.module.sass';
import { TemplateMessageInput } from './template-message/TemplateMessageInput';
import { TemplateNewState } from './useTemplateNewForm';

type DetailsFormProps = UIElementProps & {
  formState: TemplateNewState;
  input: (state: Partial<TemplateNewState>) => void;
};

export const DetailsForm = (props: DetailsFormProps) => {
  const { className, input, formState } = props;

  const { name, msg, formattedStr, formattedStrError, msgError } = formState;

  return (
    <Form className={classNames(styles.form, className)}>
      <Container className={styles.left} direction="column">
        <Container className={styles.top}>
          <FormControl label="Template name" className={styles.name_input}>
            <TextInput
              placeholder="Type template name here"
              margin="none"
              value={name}
              onChange={(value) => {
                input({ name: value.target.value });
              }}
            />
          </FormControl>
        </Container>
        <TemplateMessageInput
          templateStrError={formattedStrError}
          msgError={msgError}
          message={msg}
          setMessage={(msg) => input({ msg })}
          templateStr={formattedStr}
          setTemplateStr={(formattedStr) => input({ formattedStr })}
        />
      </Container>
    </Form>
  );
};
