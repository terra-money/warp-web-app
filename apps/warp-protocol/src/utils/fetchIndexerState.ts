import { createApiEndpoint } from 'hooks';

interface StateEntry {
  pk: string;
  height: number;
}

export const fetchIndexerState = async (networkName: string, chainName: string): Promise<StateEntry[]> => {
  const endpoint = createApiEndpoint(networkName, {
    path: 'v1/health-check',
    params: { type: 'state', chain: chainName },
  });

  try {
    const response = await fetch(endpoint);

    return (await response.json()) as StateEntry[];
  } catch (err) {
    return [];
  }
};
