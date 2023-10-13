import styles from './Home.module.sass';
import { TopContent } from 'pages/home/top-content/TopContent';
import { FeaturesContent } from 'pages/home/features/Features';
import { UIElementProps } from '@terra-money/apps/components';
import CardStack from 'card-stack/CardStack';
import { Text } from 'text';

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
      <div className={styles.cards}>
        <div className={styles.title}>How it works?</div>
        <div className={styles.description_top}>
          Using Warp, developers (and their users) can queue{' '}
          <span className={styles.bold}>
            any transaction to be executed automatically in the future
          </span>{' '}
          based on any available on-chain data.
        </div>
        <CardStack className={styles.card_stack} />
        <div className={styles.description_below}>
          The transactions are called <span className={styles.bold}>jobs</span>,
          and the circumstances under which they become executable are called{' '}
          <span className={styles.bold}>conditions</span>. When conditions are
          met, a job can be executed by anyone running a Warp keeper bot in
          exchange for that job’s reward (paid in the chain's native token).
        </div>
      </div>
    </div>
  );
};

export default Home;
