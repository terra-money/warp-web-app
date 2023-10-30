import styles from './App.module.sass';
import { TopBar } from './top-bar/TopBar';
import { BottomBar } from './bottom-bar/BottomBar';
import { useCallback, useRef, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router';
import Home from 'pages/home/Home';
import Brand from 'pages/brand/Brand';

export const APP_URL = 'https://app.warp.money';

function baseUrl(url: string) {
  const parsedUrl = new URL(url);
  let baseUrl = parsedUrl.origin;
  return baseUrl;
}

const App = () => {
  const topBarRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  const onHomeClick = useCallback(() => {
    navigate('/home');
    topBarRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [topBarRef, navigate]);

  const onDocsClick = useCallback(() => {
    window.open('https://docs.warp.money');
  }, []);

  const onBrandClick = useCallback(() => {
    navigate('brand');
  }, [navigate]);

  const onFeaturesClick = useCallback(() => {
    navigate('/home');

    setTimeout(() => {
      featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  }, [featuresRef, navigate]);

  const onWebAppClick = useCallback(() => {
    window.open(APP_URL);
  }, []);

  // const onContactClick = useCallback(() => {
  //   window.open('mailto:contact@warp.money');
  // }, []);

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
    window.open(`${baseUrl(document.location.href)}/pdfs/privacy_policy.pdf`);
  }, []);

  const onTermsClick = useCallback(() => {
    window.open(`${baseUrl(document.location.href)}/pdfs/terms_of_use.pdf`);
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
      <Routes>
        <Route
          path="/home"
          element={
            <Home
              onDocsClick={onDocsClick}
              onWebAppClick={onWebAppClick}
              featuresRef={featuresRef}
            />
          }
        />
        <Route path="/brand" element={<Brand />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>

      <BottomBar
        onDocsClick={onDocsClick}
        onFeaturesClick={onFeaturesClick}
        onHomeClick={onHomeClick}
        onPrivacyPolicyClick={onPrivacyPolicyClick}
        onTermsClick={onTermsClick}
        onTwitterClick={onTwitterClick}
        onTelegramClick={onTelegramClick}
        onDiscordClick={onDiscordClick}
        onContactClick={onTelegramClick}
        onBrandClick={onBrandClick}
        className={styles.bottom_bar}
      />
    </div>
  );
};

export default App;
