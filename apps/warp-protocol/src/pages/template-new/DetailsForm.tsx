import { Container, UIElementProps } from '@terra-money/apps/components';
import classNames from 'classnames';
import { FormControl } from 'components/form-control/FormControl';
import { Form } from 'components/form/Form';
import { TextInput } from 'components/primitives/text-input';
import styles from './TemplateNew.module.sass';
import { TemplateMessageInput } from './template-message/TemplateMessageInput';
import { warp_controller } from 'types';
import { TemplateKindInput } from './template-kind-input/TemplateKindInput';
import { TemplateNewState } from './useTemplateNewForm';

type DetailsFormProps = UIElementProps & {
  formState: TemplateNewState;
  input: (state: Partial<TemplateNewState>) => void;
};

const templateKinds: warp_controller.TemplateKind[] = ['query', 'msg'];

export const DetailsForm = (props: DetailsFormProps) => {
  const { className, input, formState } = props;

  const { name, msg, formattedStr, kind, formattedStrError, msgError } = formState;

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
          <TemplateKindInput
            value={kind}
            placeholder="Select template type"
            className={styles.template_kind_input}
            onChange={(val) => input({ kind: val })}
            label="Template type"
            options={templateKinds}
          />
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
