import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Frame from '../frame/Frame';
import transitionStyles from './CardStack.module.sass';

const CardStack: React.FC = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const cards = [
    {
      ellipseText: 'LIVE',
      viewers: '123421',
      jobName: 'Job 1',
      jobStatus: 'Not executed yet',
      rewardValue: '20 Luna',
      latestBidValue: '10 Luna',
    },
    {
      ellipseText: 'OFFLINE',
      viewers: '50000',
      jobName: 'Job 2',
      jobStatus: 'Completed',
      rewardValue: '15 Luna',
      latestBidValue: '14 Luna',
    },
    {
      ellipseText: 'LIVE',
      viewers: '200000',
      jobName: 'Job 3',
      jobStatus: 'In Progress',
      rewardValue: '25 Luna',
      latestBidValue: '20 Luna',
    },
    {
      ellipseText: 'OFFLINE',
      viewers: '1000',
      jobName: 'Job 4',
      jobStatus: 'Not started',
      rewardValue: '10 Luna',
      latestBidValue: '5 Luna',
    },
    {
      ellipseText: 'LIVE',
      viewers: '500000',
      jobName: 'Job 5',
      jobStatus: 'In Progress',
      rewardValue: '30 Luna',
      latestBidValue: '28 Luna',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [cards.length]);

  return (
    <div className={transitionStyles['card-stack']}>
      {/* TransitionGroup for frontmost and secondmost card */}
      <TransitionGroup>
        <CSSTransition
          key={currentCardIndex}
          timeout={400}
          classNames={{
            enter: transitionStyles['card-enter'],
            enterActive: transitionStyles['card-enter-active'],
            exit: transitionStyles['card-exit'],
            exitActive: transitionStyles['card-exit-active'],
          }}
        >
          <div className={transitionStyles.card}>
            <Frame {...cards[currentCardIndex]} />
          </div>
        </CSSTransition>
      </TransitionGroup>
      {/* Thirdmost card */}
      <div className={`${transitionStyles.card} ${transitionStyles['card-third']}`}>
        <Frame {...cards[(currentCardIndex + 2) % cards.length]} />
      </div>
    </div>
  );
};

export default CardStack;
