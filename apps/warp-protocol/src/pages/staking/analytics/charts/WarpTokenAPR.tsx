import { Container, UIElementProps } from '@terra-money/apps/components';
import { useTokenAPRQuery } from 'queries/useTokenAPRQuery';
import styles from './WarpTokenAPR.module.sass';
import { Panel } from 'components/panel';
import { Text } from 'components/primitives';
import classNames from 'classnames';

export const WarpTokenAPR = ({ className }: UIElementProps) => {
  const { isLoading, data } = useTokenAPRQuery('WARP');

  const APR = (data?.apr || 0) * 100;

  return (
    <Panel className={classNames(className, styles.root)} isLoading={isLoading}>
      <Container direction={'row'} className={styles.ellipse_container}>
        <div className={styles.ellipse} />
      </Container>
      <Text variant="text" className={styles.subtitle}>
        WARP Token APR
      </Text>
      <Text variant="heading1" className={styles.title}>
        {APR}%
      </Text>
    </Panel>
  );
};
