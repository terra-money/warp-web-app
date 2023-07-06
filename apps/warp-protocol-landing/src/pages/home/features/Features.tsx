import { UIElementProps } from '@terra-money/apps/components';
import React, { forwardRef } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { MobileFeaturesContent } from './MobileFeatures';
import { DesktopFeaturesContent } from './DesktopFeatures';

type FeaturesContentProps = UIElementProps & {};

export const FeaturesContent = forwardRef(
  (props: FeaturesContentProps, ref: React.Ref<HTMLDivElement>) => {
    const { className } = props;
    const isMobile = useMediaQuery('(max-width: 768px)');

    if (isMobile) {
      return <MobileFeaturesContent ref={ref} className={className} />;
    }

    return <DesktopFeaturesContent ref={ref} className={className} />;
  }
);
