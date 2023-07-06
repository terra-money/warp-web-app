import styles from './Brand.module.sass';
import { Container, UIElementProps } from '@terra-money/apps/components';
import { useCallback } from 'react';
import { TopContent } from './top-content/TopContent';
import { Text } from 'text';
import { BrandCard } from './brand-card/BrandCard';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

type BrandProps = UIElementProps & {};

const assets = [
  'images/warp_white.svg',
  'images/warp_black.svg',
  'images/w_black.svg',
  'images/w_white.svg',
  'images/sphere.png',
];

const Brand = (props: BrandProps) => {
  const onDownloadAllAssets = useCallback(() => {
    const zip = new JSZip();
    const allFilesPromises = assets.map((asset) =>
      fetch(asset).then((response) =>
        response.blob().then((blob) => {
          zip.file(asset, blob);
        })
      )
    );

    Promise.all(allFilesPromises).then(() => {
      zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(content, 'assets.zip');
      });
    });
  }, []);

  const onDownloadSingleAsset = useCallback(
    (asset: string) => () => {
      fetch(asset)
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', asset);
          document.body.appendChild(link);
          link.click();
          link.remove();
        });
    },
    []
  );

  return (
    <div className={styles.middle}>
      <TopContent
        onDownloadAll={onDownloadAllAssets}
        className={styles.top_content}
      />
      <Container className={styles.top} direction="column">
        <Text variant="heading1" className={styles.heading}>
          Logo
        </Text>
        <Text variant="label" className={styles.text}>
          Download Warp Protocol logos here.
        </Text>
        <Container className={styles.card_container} direction="row">
          <BrandCard
            imageClass={styles.text_image}
            background="black"
            image={'images/warp_black.svg'}
            label={'Logo'}
            text={'Dark background'}
            onDownloadClick={onDownloadSingleAsset('images/warp_black.svg')}
          />

          <BrandCard
            imageClass={styles.text_image}
            background="white"
            image={'images/warp_white.svg'}
            label={'Logo'}
            text={'White background'}
            onDownloadClick={onDownloadSingleAsset('images/warp_white.svg')}
          />

          <BrandCard
            imageClass={styles.text_image}
            background="black"
            image={'images/w_black.svg'}
            label={'Compact Logo'}
            text={'Dark background'}
            onDownloadClick={onDownloadSingleAsset('images/w_black.svg')}
          />

          <BrandCard
            imageClass={styles.text_image}
            background="white"
            image={'images/w_white.svg'}
            label={'Compact logo'}
            text={'White background'}
            onDownloadClick={onDownloadSingleAsset('images/w_white.svg')}
          />
        </Container>
      </Container>

      <Container className={styles.bottom} direction="column">
        <Text variant="heading1" className={styles.heading}>
          Brand images
        </Text>
        <Text variant="label" className={styles.text}>
          Download Warp Protocol assets here.
        </Text>
        <Container className={styles.card_container} direction="row">
          <BrandCard
            imageClass={styles.sphere}
            background="black"
            image={'images/sphere.png'}
            label={'Background'}
            text={'Warp brand sphere'}
            onDownloadClick={onDownloadSingleAsset('images/sphere.png')}
          />
          <BrandCard
            className={styles.hidden}
            background="black"
            image={'images/sphere.png'}
            label={'Background'}
            text={'Warp brand sphere'}
            onDownloadClick={() => {}}
          />
        </Container>
      </Container>
    </div>
  );
};

export default Brand;
