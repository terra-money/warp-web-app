import { Text } from 'text';
import classNames from 'classnames';
import { UIElementProps } from '@terra-money/apps/components';
import React, { forwardRef, useState } from 'react';
import styles from './MobileFeatures.module.sass';
import { Link } from '../../../link';

type Feature = {
  id: number;
  imageUrl: string;
  heading: string;
  description: string;
  footer: string | JSX.Element;
};

const features: Feature[] = [
  {
    id: 0,
    imageUrl: 'images/QuerySlide.png',
    heading: 'Generic',
    description: 'Logic composition',
    footer:
      'Define logic using executable payloads, contract queries, and custom messages to create attractive, automated platform features and experiences.',
  },
  {
    id: 1,
    imageUrl: 'images/ConditionSlide.png',
    heading: 'Define execution with',
    description: 'Custom conditions',
    footer:
      'Create jobs based on any available on-chain data using boolean logic and math operators. No smart contract changes necessary.',
  },
  {
    id: 2,
    imageUrl: 'images/DashboardSlide.png',
    heading: 'Create customizable',
    description: 'Recurring jobs',
    footer:
      'Compose jobs made up of multiple transactions organized in an atomic list-form. These can be simple in nature, such as sending a transaction, or complex and recursive, whereby a job message is made up of multiple transactions.',
  },
  {
    id: 3,
    imageUrl: 'images/SdkSlide2.png',
    heading: 'Start building with',
    description: 'Seamless integration',
    footer: (
      <>
        <span>
          Using Warp's advanced SDK, developers can experiment and seamlessly
          integrate Warp functionality right into their front or backend in just
          a few minutes.
        </span>
        <Link
          onClick={() => {
            window.open('https://github.com/terra-money/warp-sdk');
          }}
        >
          Warp SDK
        </Link>
      </>
    ),
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
