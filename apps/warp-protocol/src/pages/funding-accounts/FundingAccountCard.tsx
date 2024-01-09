import { Container, UIElementProps } from '@terra-money/apps/components';
import classNames from 'classnames';
import { Text } from 'components/primitives';
import styles from './FundingAccountCard.module.sass';
import { Panel } from 'components/panel';
import { warp_account_tracker } from '@terra-money/warp-sdk';
import { useNavigate } from 'react-router';

interface FundingAccountCardProps extends UIElementProps {
  fundingAccount: warp_account_tracker.FundingAccount;
}

export const FundingAccountCard = (props: FundingAccountCardProps) => {
  const { className, fundingAccount } = props;

  const navigate = useNavigate();

  return (
    <Panel
      className={classNames(className, styles.root)}
      onClick={() => navigate(`/funding-accounts/${fundingAccount.account_addr}`)}
    >
      <Container className={styles.top}>
        <Container className={styles.left} direction="column">
          <Text variant="text" className={styles.name}>
            {fundingAccount.account_addr}
          </Text>
        </Container>
      </Container>
      <Container className={styles.bottom} direction="row">
        TODO
      </Container>
    </Panel>
  );
};
