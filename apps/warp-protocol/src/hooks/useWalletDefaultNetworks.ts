import { useState, useEffect } from 'react';
import { getInitialConfig, InfoResponse } from '@terra-money/wallet-kit';
import { injectiveNetworks } from '@terra-money/apps/hooks';

export const useWalletDefaultNetworks = (): InfoResponse | undefined => {
  const [config, setConfig] = useState<InfoResponse | undefined>();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const result = await getInitialConfig();

        setConfig({ ...result, ...injectiveNetworks });
      } catch (err) {
        setConfig(undefined);
      }
    };

    fetchConfig();
  }, []);

  return config;
};
