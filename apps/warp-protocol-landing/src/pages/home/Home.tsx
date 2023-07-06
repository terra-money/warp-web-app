import styles from './Home.module.sass';
import { TopContent } from 'pages/home/top-content/TopContent';
import { FeaturesContent } from 'pages/home/features/Features';
import { UIElementProps } from '@terra-money/apps/components';

type HomeProps = UIElementProps & {
  onDocsClick: () => void;
  onWebAppClick: () => void;
  featuresRef: any;
};

const Home = (props: HomeProps) => {
  const { onDocsClick, onWebAppClick, featuresRef } = props;

  return (
    <div className={styles.middle}>
      <TopContent
        onDocsClick={onDocsClick}
        onWebAppClick={onWebAppClick}
        className={styles.top_content}
      />
      <FeaturesContent ref={featuresRef} className={styles.features_content} />
    </div>
  );
};

export default Home;
