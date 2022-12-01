import { Container, UIElementProps } from '@terra-money/apps/components';
import { useLocation } from 'react-router';
import styles from './Header.module.sass';
import { Step } from './step/Step';

type HeaderProps = UIElementProps & {};

export const Header = (props: HeaderProps) => {
  const location = useLocation();

  return (
    <Container direction="row" className={styles.root}>
      <Step
        label="Job details"
        step={1}
        selected={location.pathname.endsWith('/job-details')}
        valid={location.pathname.endsWith('/create-condition')}
      />
      <Step label="Create condition" step={2} selected={location.pathname.endsWith('/create-condition')} />
    </Container>
  );
};
