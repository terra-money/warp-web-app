import { Container, UIElementProps } from '@terra-money/apps/components';
import { Text, Throbber } from 'components/primitives';
import classNames from 'classnames';
import styles from './Panel.module.sass';

interface PanelProps extends UIElementProps {
  title?: string;
  isLoading?: boolean;
  ThrobberProps?: UIElementProps & {};
  onClick?: () => void;
}

export const Panel = (props: PanelProps) => {
  const { ThrobberProps, className, title, children, isLoading, onClick } = props;

  return (
    <Container className={classNames(className, styles.root)} component="section" direction="column" onClick={onClick}>
      {title && (
        <Text variant="label" className={styles.title}>
          {title}
        </Text>
      )}

      {isLoading ? <Throbber {...ThrobberProps} /> : children}
    </Container>
  );
};
