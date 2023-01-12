import { Text } from 'components/primitives';

import styles from './Templates.module.sass';
import { ActionButton } from 'components/action-button/ActionButton';
import { Container } from '@terra-money/apps/components';
import { useNewTemplateDialog } from 'components/layout/dialogs/NewTemplateDialog';

export const EmptyView = () => {
  const openNewTemplateDialog = useNewTemplateDialog();

  return (
    <Container className={styles.empty} direction="column">
      <Text variant="text">Nothing to display. Results will appear after a template is created.</Text>
      <ActionButton className={styles.button} variant="primary" fill="none" onClick={() => openNewTemplateDialog({})}>
        New template
      </ActionButton>
    </Container>
  );
};
