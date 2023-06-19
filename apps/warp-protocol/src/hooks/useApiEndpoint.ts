import { useWallet } from '@terra-money/wallet-provider';
import { Frequency } from 'utils';

const API_ENDPOINTS: Record<string, string> = {
  mainnet: 'https://6lk4momaf2.execute-api.us-east-1.amazonaws.com/v1',
  testnet: 'https://qje5bzt6tl.execute-api.us-east-1.amazonaws.com/v1',
  localterra: 'http://localhost:3000',
};

const serialize = <Params extends {}>(params: Params): string => {
  return Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
};

type Direction = 'asc' | 'desc';

type AnalyticsEndpoint = {
  path: 'v1/analytics';
  params: {
    frequency: Frequency;
    limit: number;
    direction?: Direction;
    type: string;
  };
};

type HealthCheckEndpoint = {
  path: 'v1/health-check';
  params: { type: string };
};

type JobEndpoint = {
  path: 'v1/jobs/{id}';
  route: { id: string };
};

type JobHistoryEndpoint = {
  path: 'v1/jobs/{id}/history';
  route: { id: string };
  params: { limit: number; direction?: Direction };
};

type JobsEndpoint = {
  path: 'v1/jobs';
  params: { owner: string };
};

type Endpoints = AnalyticsEndpoint | HealthCheckEndpoint | JobEndpoint | JobHistoryEndpoint | JobsEndpoint;

export const createApiEndpoint = (network: string, endpoint: Endpoints): string => {
  let uri = `${API_ENDPOINTS[network]}/${endpoint.path}`;

  if ('route' in endpoint) {
    Object.entries(endpoint.route).forEach(([key, value]) => {
      uri = uri.replace(`{${key}}`, value);
    });
  }

  if ('params' in endpoint) {
    uri = `${uri}?${serialize(endpoint.params)}`;
  }

  return uri;
};

export const useApiEndpoint = (endpoint: Endpoints): string => {
  const { network } = useWallet();

  return createApiEndpoint(network.name, endpoint);
};
