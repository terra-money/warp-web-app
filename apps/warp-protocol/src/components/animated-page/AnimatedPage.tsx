import { UIElementProps } from '@terra-money/apps/components';
import classNames from 'classnames';
import { useNavigationType } from 'react-router';
import { CSSTransition } from 'react-transition-group';
import styles from './AnimatedPage.module.sass';

interface AnimatedPageProps extends UIElementProps {}

export const AnimatedPage = (props: AnimatedPageProps) => {
  const { className, children } = props;

  const type = useNavigationType();

  return (
    <CSSTransition
      classNames={{
        appear: styles.appear,
        appearActive: styles.appearActive,
      }}
      in={true}
      appear={true}
      timeout={720}
    >
      <div className={classNames(className, styles.root)} data-navigation={type}>
        {children}
      </div>
    </CSSTransition>
  );
};
