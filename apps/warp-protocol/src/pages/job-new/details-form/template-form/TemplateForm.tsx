import { Container } from '@terra-money/apps/components';
import { WasmMsgInput } from 'forms/QueryExprForm/WasmMsgInput';
import { warp_controller } from 'types';
import styles from '../DetailsForm.module.sass';
import jsonpath from 'jsonpath';
import { useEffect } from 'react';
import { TemplatesInput } from '../templates-input/TemplatesInput';
import { TemplateVarInput } from '../template-var-input/TemplateVarInput';
import { TemplateWithVarValues } from 'forms/QueryExprForm';

type TemplateVar = warp_controller.TemplateVar & { value: string };

const composeMsgFromTemplate = (template: warp_controller.Template, vars: TemplateVar[]): string => {
  let json = JSON.parse(template.msg);

  vars.forEach((v) => {
    try {
      jsonpath.value(json, v.path, v.value);
    } catch (err) {
      // consume the error
    }
  });

  return JSON.stringify(json, null, 2);
};

type TemplateFormProps = {
  onMessageComposed: (message: string) => void;
  template?: warp_controller.Template;
  setTemplate: (template: TemplateWithVarValues | undefined) => void;
  templateVars: TemplateVar[];
  setTemplateVars: (vars: TemplateVar[]) => void;
  options: warp_controller.Template[];
};

export const TemplateForm = (props: TemplateFormProps) => {
  const { onMessageComposed, template, setTemplate, templateVars, setTemplateVars, options } = props;

  useEffect(() => {
    if (template && templateVars) {
      const msg = composeMsgFromTemplate(template, Object.values(templateVars));
      onMessageComposed(msg);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template, templateVars]);

  return (
    <>
      <TemplatesInput
        label="Template"
        className={styles.template_input}
        options={options}
        placeholder="Select a template"
        value={template}
        onChange={(tmpl) => setTemplate(tmpl && { ...tmpl, vars: tmpl.vars.map((v) => ({ ...v, value: '' })) })}
      />
      {template && (
        <>
          <Container className={styles.template_vars}>
            {Object.values(templateVars).map((templateVar) => {
              return (
                <TemplateVarInput
                  templateVar={templateVar}
                  templateVars={templateVars}
                  setTemplateVars={setTemplateVars}
                />
              );
            })}
          </Container>
          <WasmMsgInput
            rootClassName={styles.template_msg_input}
            example={null}
            mode="text"
            label="Template message"
            placeholder="Type template here"
            value={template.formatted_str}
            readOnly={true}
          />
        </>
      )}
    </>
  );
};
