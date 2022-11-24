import { Container, UIElementProps } from 'shared/components';
import { useTokenAPRQuery } from '../../../../queries/useTokenAPRQuery';
import { Panel } from '../../../../components/panel';
import styles from './WarpTokenAPR.module.sass';
import { Text } from '../../../../components/primitives';
import classNames from 'classnames';

type WarpAstroLPTokenAPRProps = UIElementProps & {};

export const WarpAstroLPTokenAPR = (props: WarpAstroLPTokenAPRProps) => {
  const { className } = props;
  const { data, isLoading } = useTokenAPRQuery('WARP-ASTRO-LP');

  const APR = (data?.apr || 0) * 100;

  return (
    <Panel className={classNames(className, styles.root)} isLoading={isLoading}>
      <Container direction={'row'} className={styles.ellipse_container}>
        <div className={styles.ellipse} />
        <div className={classNames(styles.ellipse, styles.ellipse_right)} />
      </Container>
      <Text variant="text" className={styles.subtitle}>
        WARP-ASTRO LP APR
      </Text>
      <Text variant="heading1" className={styles.title}>
        {APR}%
      </Text>
    </Panel>
  );
};
