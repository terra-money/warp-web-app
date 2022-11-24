import { UIElementProps } from 'shared/components';
import classNames from 'classnames';
import { ReactNode, RefObject, useEffect, useState } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import styles from './ScrollableContainer.module.sass';

interface StickyHeaderProps extends UIElementProps {
  visible: boolean;
}

export const StickyHeader = (props: StickyHeaderProps) => {
  const { className, visible, children } = props;

  return (
    <TransitionGroup component={null}>
      {visible && (
        <CSSTransition
          className={classNames(className, styles.stickyHeader)}
          classNames={{
            enter: styles.transitionEnter,
            enterActive: styles.transitionEnterActive,
            exit: styles.transitionExit,
            exitActive: styles.transitionExitActive,
          }}
          in={true}
          mountOnEnter={true}
          unmountOnExit={true}
          timeout={{ enter: 400, exit: 400 }}
        >
          <div>{children}</div>
        </CSSTransition>
      )}
    </TransitionGroup>
  );
};

interface ScrollableContainerProps extends UIElementProps {
  stickyRef: RefObject<HTMLElement>;
  header: (sticky: boolean) => ReactNode;
}

export const ScrollableContainer = (props: ScrollableContainerProps) => {
  const { className, header, children, stickyRef } = props;

  const [stickyHeaderVisible, setStickyHeaderVisible] = useState(false);

  useEffect(() => {
    if (stickyRef.current) {
      const element = stickyRef.current;
      const observer = new IntersectionObserver(
        ([entry]) => {
          setStickyHeaderVisible(entry.isIntersecting === false);
        },
        { threshold: [0.99] }
      );
      observer.observe(element);
      return () => {
        observer.unobserve(element);
        observer.disconnect();
      };
    }
  }, [stickyRef]);

  return (
    <div className={classNames(className, styles.root)}>
      {header(stickyHeaderVisible)}
      <div className={styles.scrollableContainer}>{children}</div>
    </div>
  );
};
