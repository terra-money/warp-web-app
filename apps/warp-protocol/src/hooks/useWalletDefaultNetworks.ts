import { useState, useEffect } from 'react';
import { getInitialConfig, InfoResponse } from '@terra-money/wallet-kit';

export const useWalletDefaultNetworks = (): InfoResponse | undefined => {
  const [config, setConfig] = useState<InfoResponse | undefined>();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const result = await getInitialConfig();
        setConfig(result);
      } catch (err) {
        setConfig(undefined);
      }
    };

    fetchConfig();
  }, []);

  return config;
};
