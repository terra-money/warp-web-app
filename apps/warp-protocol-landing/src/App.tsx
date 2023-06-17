import styles from './App.module.sass';
import { TopBar } from './top-bar/TopBar';
import { BottomBar } from './bottom-bar/BottomBar';
import { useCallback, useRef, useState } from 'react';
import { TopContent } from 'top-content/TopContent';
import { FeaturesContent } from 'features/Features';

export const APP_URL = 'https://app.warp.money';

const App = () => {
  const topBarRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const onHomeClick = useCallback(() => {
    topBarRef.current?.scrollIntoView({ behavior: 'smooth',  });
  }, [topBarRef]);

  const onDocsClick = useCallback(() => {
    window.open('https://docs.warp.money');
  }, []);

  const onFeaturesClick = useCallback(() => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [featuresRef]);

  const onWebAppClick = useCallback(() => {
    window.open(APP_URL);
  }, []);

  const onContactClick = useCallback(() => {
    window.open('mailto:contact@warp.money');
  }, []);

  const onTwitterClick = useCallback(() => {
    window.open('https://twitter.com/warp_protocol');
  }, []);

  const onTelegramClick = useCallback(() => {
    window.open('https://t.me/warp_protocol');
  }, []);

  const onDiscordClick = useCallback(() => {
    window.open('https://terra.sc/warpdiscord');
  }, []);

  const onPrivacyPolicyClick = useCallback(() => {
    window.open(`${document.location.href}pdfs/privacy_policy.pdf`);
  }, []);

  const onTermsClick = useCallback(() => {
    window.open(`${document.location.href}pdfs/terms_of_use.pdf`);
  }, []);

  return (
    <div className={styles.root}>
      <TopBar
        ref={topBarRef}
        drawerOpen={drawerOpen}
        onToggleDrawer={() => setDrawerOpen((open) => !open)}
        onHomeClick={onHomeClick}
        onDocsClick={onDocsClick}
        onFeaturesClick={onFeaturesClick}
        onWebAppClick={onWebAppClick}
        onTwitterClick={onTwitterClick}
        onTelegramClick={onTelegramClick}
        onDiscordClick={onDiscordClick}
      />
      <div className={styles.middle}>
        <TopContent
          onDocsClick={onDocsClick}
          onWebAppClick={onWebAppClick}
          className={styles.top_content}
        />
        <FeaturesContent
          ref={featuresRef}
          className={styles.features_content}
        />
      </div>
      <BottomBar
        onDocsClick={onDocsClick}
        onFeaturesClick={onFeaturesClick}
        onHomeClick={onHomeClick}
        onPrivacyPolicyClick={onPrivacyPolicyClick}
        onTermsClick={onTermsClick}
        onTwitterClick={onTwitterClick}
        onTelegramClick={onTelegramClick}
        onDiscordClick={onDiscordClick}
        onContactClick={onContactClick}
        className={styles.bottom_bar}
      />
    </div>
  );
};

export default App;
