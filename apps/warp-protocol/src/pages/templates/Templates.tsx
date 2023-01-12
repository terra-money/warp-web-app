import { Text, Button, Throbber } from 'components/primitives';
import { Container } from '@terra-money/apps/components';
import { ReactComponent as PlusIcon } from 'components/assets/Plus.svg';
import styles from './Templates.module.sass';
import { ActionButton } from 'components/action-button/ActionButton';
import { useTemplatesQuery } from 'queries';
import { useState } from 'react';
import classNames from 'classnames';
import { TemplateCard } from './TemplateCard';
import { EmptyView } from './EmptyView';
import { useNewTemplateDialog } from 'components/layout/dialogs/NewTemplateDialog';

interface TemplatesProps {}

type TabType = 'job' | 'query' | 'all';

const tabTypes = ['all', 'job', 'query'] as TabType[];

const kindFromTab = (tabType: TabType) => {
  if (tabType === 'all') {
    return undefined;
  }

  if (tabType === 'job') {
    return 'msg';
  }

  return 'query';
};

export const Templates = (props: TemplatesProps) => {
  const [selectedTabType, setSelectedTabType] = useState<TabType>('all');

  const { data: templates = [], isLoading } = useTemplatesQuery({ kind: kindFromTab(selectedTabType) });

  const openNewTemplateDialog = useNewTemplateDialog();

  return (
    <Container className={styles.root} direction="column">
      <Container className={styles.header} direction="column">
        <Text variant="heading1" className={styles.title}>
          Templates
        </Text>
        <Container className={styles.top}>
          <Container className={styles.tabs} direction="row">
            {tabTypes.map((tabType) => (
              <Button
                className={classNames(styles.tab, tabType === selectedTabType && styles.selected_tab)}
                key={tabType}
                onClick={() => setSelectedTabType(tabType)}
                variant="secondary"
              >
                {tabType}
              </Button>
            ))}
          </Container>
          <ActionButton
            className={styles.new}
            icon={<PlusIcon className={styles.new_icon} />}
            iconGap="none"
            variant="primary"
            onClick={() => {
              openNewTemplateDialog({});
            }}
          >
            New
          </ActionButton>
        </Container>
      </Container>
      {isLoading && templates.length === 0 && <Throbber className={styles.throbber} />}
      <Container className={styles.templates}>
        {templates.map((template) => {
          return <TemplateCard key={template.id} template={template} />;
        })}
      </Container>
      {!isLoading && templates.length === 0 && <EmptyView />}
    </Container>
  );
};
