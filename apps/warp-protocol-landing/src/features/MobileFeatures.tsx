import { Text } from 'text';
import classNames from 'classnames';
import { UIElementProps } from '@terra-money/apps/components';
import React, { forwardRef, useState } from 'react';
import styles from './MobileFeatures.module.sass';

type Feature = {
  id: number;
  imageUrl: string;
  heading: string;
  description: string;
  footer: string;
};

const features: Feature[] = [
  {
    id: 0,
    imageUrl: 'images/DashboardSlide.png',
    heading: 'Asynchronous',
    description: 'On-chain programming',
    footer:
      'Bringing the async keyword to the world of smart contracts. Execute whatever, whenever.',
  },
  {
    id: 1,
    imageUrl: 'images/QuerySlide.png',
    heading: 'Generic way of',
    description: 'Composing logic',
    footer:
      'Define logic as you would in a programming language by supplying executable payloads. Arbitrary messages and contract queries.',
  },
  {
    id: 2,
    imageUrl: 'images/ConditionSlide.png',
    heading: 'Define execution with',
    description: 'Arbitrary condition',
    footer: 'Complete boolean logic support.',
  },
  {
    id: 4,
    imageUrl: 'images/SdkSlide.png',
    heading: 'For builders',
    description: 'Warp SDK',
    footer:
      'Build entire keeper bots and interact with warp contracts with ease.',
  },
];

type MobileFeaturesContentProps = UIElementProps & {};

export const MobileFeaturesContent = forwardRef(
  (props: MobileFeaturesContentProps, ref: React.Ref<HTMLDivElement>) => {
    const { className } = props;
    const [selectedFeature, setSelectedFeature] = useState<Feature>(
      features[0]
    );

    return (
      <div className={classNames(styles.root, className)} ref={ref}>
        <img
          alt=""
          src="images/BackgroundBigBall.png"
          className={styles.big_background}
        />
        <div className={styles.nav}>
          <Text variant="label" className={styles.watch}>
            Features to watch
          </Text>
          {features.map((feature) => (
            <div
              className={classNames(
                styles.feature,
                feature.id === selectedFeature.id && styles.selected_feature
              )}
              onClick={() => setSelectedFeature(feature)}
            >
              <Text variant="label" className={styles.heading}>
                {feature.heading}
              </Text>
              <Text variant="text" className={styles.description}>
                {feature.description}
              </Text>
            </div>
          ))}
          <div className={styles.footer}>
            <Text variant="text" className={styles.label}>
              {selectedFeature.description}
            </Text>
            <Text variant="label" className={styles.description}>
              {selectedFeature.footer}
            </Text>
          </div>
        </div>
        <div className={styles.slide}>
          <img alt="" className={styles.slide} src={selectedFeature.imageUrl} />
        </div>
      </div>
    );
  }
);
