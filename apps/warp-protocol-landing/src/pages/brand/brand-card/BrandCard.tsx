import { Container, UIElementProps } from '@terra-money/apps/components';
import classNames from 'classnames';
import { ReactComponent as DownloadIcon } from '../../../assets/Download.svg';

import { Button } from 'button';
import { Text } from 'text';

import styles from './BrandCard.module.sass';

type BrandCardProps = UIElementProps & {
  image: string;
  label: string;
  text: string;
  imageClass?: string;
  background: 'white' | 'black';
  onDownloadClick: () => void;
};

export const BrandCard = (props: BrandCardProps) => {
  const {
    image,
    label,
    text,
    onDownloadClick,
    background,
    className,
    imageClass,
  } = props;

  return (
    <Container className={classNames(styles.root, className)}>
      <div
        className={classNames(
          styles.background,
          styles[`background_${background}`]
        )}
      >
        <img
          className={classNames(styles.img, imageClass)}
          src={image}
          alt={text}
        />
      </div>
      <Container className={styles.bottom}>
        <Container className={styles.text_container}>
          <Text variant="label" className={styles.label}>
            {label}
          </Text>
          <Text variant="text" className={styles.text}>
            {text}
          </Text>
        </Container>

        <Button
          className={styles.download}
          icon={<DownloadIcon />}
          onClick={onDownloadClick}
        />
      </Container>
    </Container>
  );
};
