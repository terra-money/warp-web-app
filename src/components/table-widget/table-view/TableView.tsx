import { Container, UIElementProps } from 'shared/components';
import classNames from 'classnames';
import styles from './TableView.module.sass';

export const TableView = ({ className, children }: UIElementProps) => {
  return <Container className={classNames(className, styles.table_view)}>{children}</Container>;
};
