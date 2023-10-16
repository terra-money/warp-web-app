import { UIElementProps } from '@terra-money/apps/components';
import classNames from 'classnames';
import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Frame from '../frame/Frame';
import styles from './CardStack.module.sass';

type CardStackProps = UIElementProps & {};

const CardStack: React.FC<CardStackProps> = (props) => {
  const { className } = props;
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const cards = [
    {
      ellipseText: 'Pending',
      viewers: '123421',
      jobName: 'Astroport limit order',
      jobStatus: 'Waiting on condition...',
      rewardValue: '20 Luna',
      latestBidValue: '10 Luna',
    },
    {
      ellipseText: 'Pending',
      viewers: '50000',
      jobName: 'LionDAO distribute rewards',
      jobStatus: 'Waiting on condition...',
      rewardValue: '15 Luna',
      latestBidValue: '14 Luna',
    },
    {
      ellipseText: 'Pending',
      viewers: '200000',
      jobName: 'Eris harvest',
      jobStatus: 'Waiting on condition...',
      rewardValue: '25 Luna',
      latestBidValue: '20 Luna',
    },
    {
      ellipseText: 'Pending',
      viewers: '1000',
      jobName: 'PixeLions distribute rewards',
      jobStatus: 'Waiting on condition...',
      rewardValue: '10 Luna',
      latestBidValue: '5 Luna',
    },
    {
      ellipseText: 'Pending',
      viewers: '500000',
      jobName: 'Luna burn',
      jobStatus: 'Waiting on condition...',
      rewardValue: '30 Luna',
      latestBidValue: '28 Luna',
    },
  ];

  const [executedCardIndex, setExecutedCardIndex] = useState(0);
  const [isInExecutionPhase, setIsInExecutionPhase] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isInExecutionPhase) {
        setIsInExecutionPhase(false);
        setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
      } else {
        setIsInExecutionPhase(true);
        setExecutedCardIndex(currentCardIndex);
      }
    }, 800); // Adjust time as needed

    return () => clearInterval(timer);
  }, [cards.length, isInExecutionPhase, currentCardIndex]);

  return (
    <div className={classNames(styles['card-stack'], className)}>
      {/* TransitionGroup for frontmost and secondmost card */}
      <TransitionGroup>
        <CSSTransition
          key={currentCardIndex}
          timeout={1200} // Delay exit when in execution phase
          classNames={{
            enter: styles['card-enter'],
            enterActive: styles['card-enter-active'],
            exit: styles['card-exit'],
            exitActive: styles['card-exit-active'],
          }}
        >
          <div className={styles.card}>
            <Frame
              {...cards[currentCardIndex]}
              isExecuted={currentCardIndex === executedCardIndex}
            />
          </div>
        </CSSTransition>
      </TransitionGroup>
      {/* Thirdmost card */}
      <div
        className={`${styles.card} ${styles['card-third']}`}
      >
        <Frame {...cards[(currentCardIndex + 2) % cards.length]} isExecuted={false} />
      </div>
    </div>
  );
};

export default CardStack;
