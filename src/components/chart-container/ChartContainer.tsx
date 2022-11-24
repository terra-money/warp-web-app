import { UIElementProps } from 'shared/components';
import classNames from 'classnames';
import { Panel } from 'components/panel';
import { Text, Throbber } from 'components/primitives';
import { ReactNode } from 'react';
import styles from './ChartContainer.module.sass';

type ChartContainerProps = UIElementProps & {
  title: string;
  subtitle: ReactNode;
  isLoading: boolean;
};

export const ChartContainer = (props: ChartContainerProps) => {
  const { className, title, subtitle, isLoading, children } = props;

  return (
    <Panel className={classNames(className, styles.root)} title={title}>
      {isLoading ? (
        <Throbber className={styles.throbber} />
      ) : (
        <>
          <Text variant="heading1">{subtitle}</Text>
          {children}
        </>
      )}
    </Panel>
  );
};
