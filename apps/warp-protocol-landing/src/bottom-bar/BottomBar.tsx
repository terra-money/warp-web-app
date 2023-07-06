import { UIElementProps } from '@terra-money/apps/components';
import { MobileBottomBar } from './MobileBottomBar';
import { useMediaQuery } from 'usehooks-ts';
import { DesktopBottomBar } from './DesktopBottomBar';

type BottomBarProps = UIElementProps & {
  onHomeClick: () => void;
  onDocsClick: () => void;
  onFeaturesClick: () => void;
  onContactClick: () => void;
  onTermsClick: () => void;
  onPrivacyPolicyClick: () => void;
  onDiscordClick: () => void;
  onTelegramClick: () => void;
  onTwitterClick: () => void;
  onBrandClick: () => void;
};

export const BottomBar = (props: BottomBarProps) => {
  const {
    onHomeClick,
    onFeaturesClick,
    onDocsClick,
    onContactClick,
    onTermsClick,
    onPrivacyPolicyClick,
    onDiscordClick,
    onTelegramClick,
    onTwitterClick,
    onBrandClick,
  } = props;

  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <MobileBottomBar
        onPrivacyPolicyClick={onPrivacyPolicyClick}
        onTermsClick={onTermsClick}
      />
    );
  }

  return (
    <DesktopBottomBar
      onHomeClick={onHomeClick}
      onFeaturesClick={onFeaturesClick}
      onDocsClick={onDocsClick}
      onContactClick={onContactClick}
      onTermsClick={onTermsClick}
      onPrivacyPolicyClick={onPrivacyPolicyClick}
      onDiscordClick={onDiscordClick}
      onTelegramClick={onTelegramClick}
      onTwitterClick={onTwitterClick}
      onBrandClick={onBrandClick}
    />
  );
};
