import { UIElementProps } from '@terra-money/apps/components';
import classNames from 'classnames';
import { Panel } from 'components/panel';
import { Text } from 'components/primitives';
import { warp_controller } from 'types';
import styles from './TemplatesNav.module.sass';

type TemplatesNavProps = UIElementProps & {
  templates: warp_controller.Template[];
  selectedTemplate: warp_controller.Template | undefined;
  setSelectedTemplate: (template: warp_controller.Template) => void;
};

export const TemplatesNav = (props: TemplatesNavProps) => {
  const { className, templates, selectedTemplate, setSelectedTemplate } = props;

  return (
    <Panel className={classNames(styles.root, className)}>
      <Text variant="label" className={styles.title}>
        Templates
      </Text>
      {templates.map((t) => (
        <div
          key={t.name}
          className={classNames(styles.template, t.name === selectedTemplate?.name && styles.selected_template)}
          onClick={() => setSelectedTemplate(t)}
        >
          {t.name}
        </div>
      ))}
      {templates.length === 0 && <div className={styles.empty}>No templates created yet.</div>}
    </Panel>
  );
};
