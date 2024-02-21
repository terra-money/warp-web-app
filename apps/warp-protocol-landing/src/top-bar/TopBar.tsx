import { UIElementProps } from '@terra-money/apps/components';
import { useMediaQuery } from 'usehooks-ts';

import { forwardRef } from 'react';
import { MobileTopBar } from './MobileTopBar';
import { DesktopTopBar } from './DesktopTopBar';

type TopBarProps = UIElementProps & {
  onHomeClick: () => void;
  onDocsClick: () => void;
  onFeaturesClick: () => void;
  onWebAppClick: () => void;
  drawerOpen: boolean;
  onToggleDrawer: () => void;
  onDiscordClick: () => void;
  onTwitterClick: () => void;
  onTelegramClick: () => void;
  onSdkClick: () => void;
  onGetInTouchClick: () => void;
};

export const TopBar = forwardRef<HTMLDivElement | null, TopBarProps>(
  (props, ref) => {
    const {
      onHomeClick,
      onFeaturesClick,
      onDocsClick,
      onWebAppClick,
      drawerOpen,
      onToggleDrawer,
      onDiscordClick,
      onTelegramClick,
      onTwitterClick,
      onSdkClick,
      onGetInTouchClick
    } = props;

    const isMobile = useMediaQuery('(max-width: 768px)');

    if (isMobile) {
      return (
        <MobileTopBar
          ref={ref}
          drawerOpen={drawerOpen}
          onDiscordClick={onDiscordClick}
          onTelegramClick={onTelegramClick}
          onTwitterClick={onTwitterClick}
          onToggleDrawer={onToggleDrawer}
          onHomeClick={onHomeClick}
          onDocsClick={onDocsClick}
          onFeaturesClick={onFeaturesClick}
          onWebAppClick={onWebAppClick}
          onSdkClick={onSdkClick}
          onGetInTouchClick={onGetInTouchClick}
        />
      );
    }

    return (
      <DesktopTopBar
        ref={ref}
        onTelegramClick={onTelegramClick}
        onDiscordClick={onDiscordClick}
        onHomeClick={onHomeClick}
        onDocsClick={onDocsClick}
        onFeaturesClick={onFeaturesClick}
        onWebAppClick={onWebAppClick}
        onTwitterClick={onTwitterClick}
        onSdkClick={onSdkClick}
        onGetInTouchClick={onGetInTouchClick}
      />
    );
  }
);
