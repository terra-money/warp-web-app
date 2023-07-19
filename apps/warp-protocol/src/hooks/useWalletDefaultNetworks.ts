import { useState, useEffect } from 'react';
import { getInitialConfig, InfoResponse } from '@terra-money/wallet-kit';
import { LCDClientConfig } from '@terra-money/feather.js';

const injectiveNetworks: LCDClientConfig[] = [
  {
    chainID: 'injective-888',
    lcd: 'https://k8s.testnet.lcd.injective.network',
    gasAdjustment: 1.75,
    gasPrices: {
      INJ: 0.05,
    },
    prefix: 'inj2',
  },
  {
    chainID: 'injective-1',
    lcd: 'https://lcd.injective.network',
    gasAdjustment: 1.75,
    gasPrices: {
      INJ: 0.05,
    },
    prefix: 'inj',
  },
];

const injectiveNetworksInfo = injectiveNetworks.reduce((obj, item) => {
  return { ...obj, [item.chainID]: item };
}, {});

export const useWalletDefaultNetworks = (): InfoResponse | undefined => {
  const [config, setConfig] = useState<InfoResponse | undefined>();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const result = await getInitialConfig();

        setConfig({ ...result, ...injectiveNetworksInfo });
      } catch (err) {
        setConfig(undefined);
      }
    };

    fetchConfig();
  }, []);

  return config;
};
