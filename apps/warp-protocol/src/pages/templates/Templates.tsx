import styles from './Templates.module.sass';
import { Container, UIElementProps } from '@terra-money/apps/components';
import { Button, Text } from 'components/primitives';
import { useEffect, useState } from 'react';
import { TemplateDetails } from './details/TemplateDetails';
import { IfConnected } from 'components/if-connected';
import { NotConnected } from 'components/not-connected';
import { useNavigate } from 'react-router';
import { TemplatesNav } from './nav/TemplatesNav';
import classNames from 'classnames';
import { warp_controller } from 'types';
import { useTemplatesQuery } from 'queries/useTemplatesQuery';

type TemplatesContentProps = {};

type TabType = 'job' | 'query';

const tabTypes = ['job', 'query'] as TabType[];

const TemplatesContent = (props: TemplatesContentProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<warp_controller.Template | undefined>(undefined);

  const [selectedTabType, setSelectedTabType] = useState<TabType>('job');

  const { data: jobTemplates = [], isLoading: isJobTemplatesLoading } = useTemplatesQuery();

  const templates: warp_controller.Template[] = selectedTabType === 'job' ? jobTemplates : jobTemplates;

  const isLoading = isJobTemplatesLoading;

  const navigate = useNavigate();

  useEffect(() => {
    setSelectedTemplate(undefined);
  }, [selectedTabType]);

  return (
    <Container direction="column" className={styles.content}>
      <Container className={styles.header}>
        <Text variant="heading1" className={styles.title}>
          Templates
        </Text>
        <Button variant="primary" onClick={() => navigate('/template-new')}>
          New template
        </Button>
      </Container>
      <Container className={styles.tabs} direction="row">
        {tabTypes.map((tabType) => (
          <Button
            className={classNames(styles.tab, tabType === selectedTabType && styles.selected_tab)}
            onClick={() => setSelectedTabType(tabType)}
            variant="secondary"
          >
            {tabType}
          </Button>
        ))}
      </Container>
      <Container className={styles.bottom} direction="row">
        <TemplatesNav
          className={styles.nav}
          selectedTemplate={selectedTemplate}
          templates={templates}
          setSelectedTemplate={setSelectedTemplate}
        />
        <TemplateDetails
          isLoading={isLoading}
          className={styles.details}
          selectedTemplate={selectedTemplate}
          onSaveTemplate={(q) => {
            setSelectedTemplate(q);
          }}
          onDeleteTemplate={(q) => {
            setSelectedTemplate(undefined);
          }}
        />
      </Container>
    </Container>
  );
};

export const Templates = (props: UIElementProps) => {
  return (
    <IfConnected
      then={
        <Container direction="column" className={styles.root}>
          <TemplatesContent />
        </Container>
      }
      else={<NotConnected />}
    />
  );
};
