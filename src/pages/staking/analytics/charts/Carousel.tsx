import { UIElementProps } from 'shared/components';
import { ReactNode } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { ReactComponent as ArrowLeft } from 'components/assets/ArrowLeft.svg';
import { ReactComponent as ArrowRight } from 'components/assets/ArrowRight.svg';
import classNames from 'classnames';
import { Button } from 'components/primitives';
import { CarouselDirection, useCarouselNavigation } from 'shared/hooks';
import styles from './Carousel.module.sass';

interface TransitionProps extends UIElementProps {
  index: number;
  direction: CarouselDirection;
}

const Transition = (props: TransitionProps) => {
  const { className, index, direction, children } = props;

  return (
    <TransitionGroup className={classNames(className, styles.container)} data-direction={direction}>
      <CSSTransition
        key={index}
        timeout={{ enter: 250, exit: 250 }}
        mountOnEnter={false}
        unmountOnExit={true}
        classNames={{
          enter: styles.transitionEnter,
          enterActive: styles.transitionEnterActive,
          exit: styles.transitionExit,
          exitActive: styles.transitionExitActive,
        }}
      >
        {children}
      </CSSTransition>
    </TransitionGroup>
  );
};

interface CarouselProps {
  children: ReactNode[];
}

export const Carousel = (props: CarouselProps) => {
  const { children } = props;

  const { indicies, direction, transitionLeft, transitionRight } = useCarouselNavigation(3);

  return (
    <div className={styles.root}>
      {indicies.map((index, i) => (
        <Transition key={i} index={index} direction={direction}>
          {children[index]}
        </Transition>
      ))}
      <div className={styles.arrows}>
        <Button
          variant="secondary"
          className={styles.leftArrow}
          onClick={transitionRight}
          icon={<ArrowLeft />}
          iconGap="none"
        />
        <Button
          variant="secondary"
          className={styles.rightArrow}
          onClick={transitionLeft}
          icon={<ArrowRight />}
          iconGap="none"
        />
      </div>
    </div>
  );
};
