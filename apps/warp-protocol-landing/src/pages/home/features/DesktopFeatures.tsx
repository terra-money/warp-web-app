import { Text } from 'text';
import classNames from 'classnames';
import { UIElementProps } from '@terra-money/apps/components';
import React, { forwardRef, useState } from 'react';
import styles from './DesktopFeatures.module.sass';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
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
          className={styles.sdk_link}
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

type DesktopFeaturesContentProps = UIElementProps & {};

export const DesktopFeaturesContent = forwardRef(
  (props: DesktopFeaturesContentProps, ref: React.Ref<HTMLDivElement>) => {
    const { className } = props;
    const [expandedFeatureId, setExpandedFeatureId] = useState<number | null>(
      0
    );

    const isExpanded = (id: number) => id === expandedFeatureId;

    return (
      <div className={classNames(styles.root, className)} ref={ref}>
        <div className={styles.title}>Generic way of composing logic</div>
        <div className={styles.description_title}>
          Using Warp, developers (and their users) can queue{' '}
          <span className={styles.bold}>
            any transaction to be executed automatically in the future
          </span>{' '}
          based on any available on-chain data.
        </div>
        {features.map((feature) => (
          <div
            key={feature.id}
            className={classNames(
              styles.feature,
              isExpanded(feature.id) && styles.selected_feature
            )}
            onClick={() =>
              setExpandedFeatureId(isExpanded(feature.id) ? null : feature.id)
            }
          >
            <div className={styles.toggle}>
              <KeyboardArrowDownIcon className={styles.chevron} />
            </div>

            <Text variant="label" className={styles.heading}>
              {feature.heading}
            </Text>
            <Text variant="text" className={styles.description}>
              {feature.description}
            </Text>
            {isExpanded(feature.id) && (
              <Text variant="label" className={styles.footer}>
                {feature.footer}
              </Text>
            )}
          </div>
        ))}
      </div>
    );
  }
);
