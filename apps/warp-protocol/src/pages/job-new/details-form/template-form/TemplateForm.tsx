import { Container } from '@terra-money/apps/components';
import { WasmMsgInput } from 'forms/QueryExprForm/WasmMsgInput';
import { warp_controller } from 'types';
import styles from '../DetailsForm.module.sass';
import jsonpath from 'jsonpath';
import { useEffect, useMemo } from 'react';
import { TemplatesInput } from '../templates-input/TemplatesInput';
import { TemplateVarInput } from '../template-var-input/TemplateVarInput';
import { findVariablePath, templateVariables } from 'utils/variable';

const composeMsgFromTemplate = (template: warp_controller.Template): string => {
  const vars = templateVariables(template);
  let json = JSON.parse(template.msg);

  vars.forEach((v) => {
    try {
      const path = findVariablePath(json, v.name);

      if (path) {
        jsonpath.value(json, path, v.value);
      }
    } catch (err) {
      // consume the error
    }
  });

  return JSON.stringify(json, null, 2);
};

type TemplateFormProps = {
  onMessageComposed: (message: string) => void;
  template?: warp_controller.Template;
  setTemplate: (template: warp_controller.Template | undefined) => void;
  setTemplateVars: (vars: warp_controller.StaticVariable[]) => void;
  options: warp_controller.Template[];
};

export const TemplateForm = (props: TemplateFormProps) => {
  const { onMessageComposed, template, setTemplate, setTemplateVars, options } = props;

  useEffect(() => {
    if (template) {
      const msg = composeMsgFromTemplate(template);
      onMessageComposed(msg);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template]);

  const templateVars = useMemo(() => (template ? templateVariables(template) : []), [template]);

  return (
    <>
      <TemplatesInput
        label="Template"
        className={styles.template_input}
        options={options}
        placeholder="Select a template"
        value={template}
        onChange={(tmpl) => setTemplate(tmpl)}
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
