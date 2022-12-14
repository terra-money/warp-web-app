import styles from './Templates.module.sass';
import { Container, UIElementProps } from '@terra-money/apps/components';
import { Button, Text } from 'components/primitives';
import { Template, useTemplateStorage } from './useTemplateStorage';
import { useState } from 'react';
import { TemplateDetails } from './details/TemplateDetails';
import { IfConnected } from 'components/if-connected';
import { NotConnected } from 'components/not-connected';
import { useNavigate } from 'react-router';
import { TemplatesNav } from './nav/TemplatesNav';
import classNames from 'classnames';

type TemplatesContentProps = {};

type TabType = 'job' | 'query';

const tabTypes = ['job', 'query'] as TabType[];

export const mockTemplates = (): Template[] => [
  {
    name: 'test template',
    formattedStr: 'Purchase Luna for {purchase amount} axlUSDC every {weeks} weeks on Astroport Luna/axlUSDC LP.',
    msg: JSON.stringify(
      {
        wasm: {
          execute: {
            contract_addr: 'test-addr',
            msg: {
              test_msg: {
                amount: '123',
                weeks: '123',
              },
            },
            funds: [],
          },
        },
      },
      null,
      2
    ),
    type: 'job',
    vars: [
      {
        name: 'purchase amount',
        path: '$.wasm.execute.msg.test_msg.amount',
      },
      {
        name: 'weeks',
        path: '$.wasm.execute.msg.test_msg.weeks',
      },
    ],
  },
];

const TemplatesContent = (props: TemplatesContentProps) => {
  const { saveTemplate, removeTemplate } = useTemplateStorage();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | undefined>(undefined);

  const [selectedTabType, setSelectedTabType] = useState<TabType>('job');

  const templates: Template[] = mockTemplates();

  const navigate = useNavigate();

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
          className={styles.details}
          selectedTemplate={selectedTemplate}
          saveTemplate={(q) => {
            saveTemplate(q);
            setSelectedTemplate(q);
          }}
          deleteTemplate={(q) => {
            removeTemplate(q);
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
