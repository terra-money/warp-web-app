import { Container, UIElementProps } from 'shared/components';
import { Button, Text } from '../../../components/primitives';
import styles from './CurrentStakingPanel.module.sass';
import { Panel } from '../../../components/panel';
import classNames from 'classnames';
import { useStakeWarpDialog } from '../../../components/dialog/stake-warp';

export type CurrentStakingPanelProps = UIElementProps & {};

export const CurrentStakingPanel = (props: CurrentStakingPanelProps) => {
  const { className } = props;
  const openDialog = useStakeWarpDialog();

  return (
    <Panel className={classNames(className)}>
      <Text variant={'text'} className={styles.panel_title}>
        Staking
      </Text>

      <Container direction={'row'} gap={160}>
        <Container direction={'column'} gap={8}>
          <Text variant={'label'}>Currently staking</Text>
          <Text variant={'text'}>2,7M</Text>
        </Container>
        <Container direction={'column'} gap={8} className={styles.penultimate_column}>
          <Text variant={'label'}>Available to stake</Text>
          <Text variant={'text'}>2,7M</Text>
        </Container>

        <Container direction={'row'} gap={16}>
          <Button variant={'primary'} onClick={() => openDialog(undefined)}>
            Stake
          </Button>
          <Button>Withdraw</Button>
        </Container>
      </Container>
    </Panel>
  );
};
