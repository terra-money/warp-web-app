import { Text, Throbber } from 'components/primitives';
import { Container } from '@terra-money/apps/components';
import { ReactComponent as PlusIcon } from 'components/assets/Plus.svg';
import styles from './Templates.module.sass';
import { ActionButton } from 'components/action-button/ActionButton';
import { useTemplatesQuery } from 'queries';
import { TemplateCard } from './TemplateCard';
import { EmptyView } from './EmptyView';
import { useNavigate } from 'react-router';

interface TemplatesProps {}

export const Templates = (props: TemplatesProps) => {
  const { data: templates = [], isLoading } = useTemplatesQuery();

  const navigate = useNavigate();

  return (
    <Container className={styles.root} direction="column">
      <Container className={styles.header} direction="column">
        <Text variant="heading1" className={styles.title}>
          Templates
        </Text>
        <Container className={styles.top}>
          <ActionButton
            className={styles.new}
            icon={<PlusIcon className={styles.new_icon} />}
            iconGap="none"
            variant="primary"
            onClick={() => {
              navigate('/template-new/details');
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
