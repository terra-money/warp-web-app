import styles from './Home.module.sass';
import { TopContent } from 'pages/home/top-content/TopContent';
import { FeaturesContent } from 'pages/home/features/Features';
import { UIElementProps } from '@terra-money/apps/components';
import CardStack from 'card-stack/CardStack';
import AnimatedDisplay from 'animated-display/AnimatedDisplay';

type HomeProps = UIElementProps & {
  onDocsClick: () => void;
  onWebAppClick: () => void;
  onGetInTouchClick: () => void;
  featuresRef: any;
};

const CardContent = () => {
  return (
    <div className={styles.cards}>
      <div className={styles.title}>How it works</div>
      <div className={styles.description_top}>
        Using Warp, developers (and, by default, their users) can{' '}
        <span className={styles.bold}>schedule</span> transactions to execute
        automatically in the future based on any available on-chain data.
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
  );
};

const Home = (props: HomeProps) => {
  const { onDocsClick, onWebAppClick, onGetInTouchClick, featuresRef } = props;

  return (
    <div>
      <TopContent
        onDocsClick={onDocsClick}
        onWebAppClick={onWebAppClick}
        onGetInTouchClick={onGetInTouchClick}
        className={styles.top_content}
      />
      <CardContent />
      <AnimatedDisplay className={styles.animated_display} />
      <FeaturesContent ref={featuresRef} className={styles.features_content} />
    </div>
  );
};

export default Home;
