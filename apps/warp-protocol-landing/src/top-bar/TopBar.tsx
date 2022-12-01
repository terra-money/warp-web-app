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
        />
      );
    }

    return (
      <DesktopTopBar
        ref={ref}
        onHomeClick={onHomeClick}
        onDocsClick={onDocsClick}
        onFeaturesClick={onFeaturesClick}
        onWebAppClick={onWebAppClick}
      />
    );
  }
);
