import { Container, UIElementProps } from '@terra-money/apps/components';
import classNames from 'classnames';
import { Text } from 'components/primitives';
import styles from './TemplateCard.module.sass';
import { Panel } from 'components/panel';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useDeleteTemplateTx } from 'tx';
import { MenuAction } from 'components/menu-button/MenuAction';
import { DropdownMenu } from 'components/dropdown-menu/DropdownMenu';
import { useNavigate } from 'react-router';
import { useMemo } from 'react';
import { useJobStorage } from 'pages/job-new/useJobStorage';
import { useLocalWallet } from '@terra-money/apps/hooks';
import { useEditTemplateDialog } from './edit-template';
import { useCopy } from 'hooks';
import { ActionButton } from 'components/action-button/ActionButton';
import { Template } from 'types';

interface TemplateCardProps extends UIElementProps {
  template: Template;
}

type FormattedDisplayProps = UIElementProps & {
  formattedString: string;
};

function parseFormattedString(str: string): { type: 'text' | 'var'; value: string }[] {
  return str.split(/{|}/).map((part, i) => ({
    type: i % 2 === 0 ? 'text' : 'var',
    value: part,
  }));
}

const FormattedDisplay = (props: FormattedDisplayProps) => {
  const { formattedString } = props;

  const parsed = useMemo(() => parseFormattedString(formattedString), [formattedString]);

  return (
    <div className={styles.formatted_display}>
      {parsed.map((p, i) =>
        p.type === 'text' ? (
          <span key={i}>{p.value}</span>
        ) : (
          <span key={i} className={styles.highlighted}>{`{${p.value}}`}</span>
        )
      )}
    </div>
  );
};

export const TemplateCard = (props: TemplateCardProps) => {
  const { className, template } = props;

  const [, deleteTemplateTx] = useDeleteTemplateTx();

  const navigate = useNavigate();

  const { setJobTemplate } = useJobStorage();

  const localWallet = useLocalWallet();

  const openEditTemplateDialog = useEditTemplateDialog();

  const copy = useCopy('message', JSON.stringify(JSON.parse(template.msg), null, 2));

  return (
    <Panel className={classNames(className, styles.root)}>
      <Container className={styles.top}>
        <Container className={styles.left} direction="column">
          <Text variant="text" className={styles.name}>
            {template.name}
          </Text>
          <Text variant="label" className={styles.owner}>
            {template.owner}
          </Text>
        </Container>
        <Container className={styles.right}>
          <DropdownMenu
            menuClass={styles.menu}
            action={
              <ActionButton
                className={styles.menu_btn}
                variant="primary"
                fill="none"
                icon={<MoreVertIcon />}
                iconGap="none"
              />
            }
          >
            <MenuAction
              onClick={() => {
                setJobTemplate(template);
                navigate(`/job-new`);
              }}
            >
              New job
            </MenuAction>
            {localWallet?.walletAddress === template.owner && (
              <MenuAction onClick={() => openEditTemplateDialog({ template })}>Edit</MenuAction>
            )}
            {localWallet?.walletAddress === template.owner && (
              <MenuAction
                onClick={async () => {
                  await deleteTemplateTx({ id: template.id });
                }}
              >
                Delete
              </MenuAction>
            )}

            <MenuAction onClick={copy}>Copy message</MenuAction>
          </DropdownMenu>
        </Container>
      </Container>
      <Container className={styles.bottom} direction="row">
        <FormattedDisplay formattedString={template.formatted_str} />
      </Container>
    </Panel>
  );
};
