import { Container, UIElementProps } from 'shared/components';

import styles from './Footer.module.sass';
import { ReactNode } from 'react';
import classNames from 'classnames';

type FooterProps = {
  display?: FooterDisplay;
  children?: ReactNode;
} & UIElementProps;

export enum FooterDisplay {
  NoMoreRows = 'NoMoreRows',
  MoreRowsBelow = 'MoreRowsBelow',
  LoadingMoreRows = 'LoadingMoreRows',
}

const displayMap = {
  [FooterDisplay.LoadingMoreRows]: 'Loading more data...',
  [FooterDisplay.NoMoreRows]: 'No more data to display.',
  [FooterDisplay.MoreRowsBelow]: 'More data below, scroll down to display.',
};

export const Footer = (props: FooterProps) => {
  const { display, children, className } = props;

  return (
    <Container className={classNames(className, styles.root)} direction="column">
      {display && <div>{displayMap[display]}</div>}
      {children}
    </Container>
  );
};
