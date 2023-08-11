import dotenv from 'dotenv';
import { Epoch } from '@apps-shared/indexers/types';
import { ChainModule, ChainName, ContractAddresses } from '@terra-money/warp-sdk';
import { LCDClient, LCDClientConfig } from '@terra-money/feather.js';

dotenv.config();

const mainnetConfig: Record<string, LCDClientConfig> = {
  'phoenix-1': {
    chainID: 'phoenix-1',
    lcd: 'https://phoenix-lcd.terra.dev',
    gasAdjustment: 1.75,
    gasPrices: { uluna: 0.15 },
    prefix: 'terra',
  },
  'injective-1': {
    chainID: 'injective-1',
    lcd: 'https://lcd.injective.network',
    gasAdjustment: 1.75,
    gasPrices: {
      inj: 1500000000,
    },
    prefix: 'inj',
  },
};

const testnetConfig: Record<string, LCDClientConfig> = {
  'pisco-1': {
    lcd: 'https://pisco-lcd.terra.dev',
    chainID: 'pisco-1',
    gasAdjustment: 1.75,
    gasPrices: { uluna: 0.15 },
    prefix: 'terra',
  },
  'injective-888': {
    chainID: 'injective-888',
    lcd: 'https://k8s.testnet.lcd.injective.network',
    gasAdjustment: 1.75,
    gasPrices: {
      inj: 1500000000,
    },
    prefix: 'inj',
  },
};

export class Environment {
  public static lcd: LCDClient;
  public static chain: ChainModule;

  static load() {
    dotenv.config();
    Environment.lcd = new LCDClient(process.env.NETWORK === 'mainnet' ? mainnetConfig : testnetConfig);
    // set to terra by default, not relevant
    Environment.chain = new ChainModule(
      Environment.lcd.config[process.env.NETWORK === 'mainnet' ? 'phoenix-1' : 'pisco-1']
    );
  }

  static getGenesis = (chainName: string): Epoch => {
    // TODO: figure out what to do with this
    if (chainName === 'terra') {
      if (process.env.NETWORK === 'mainnet') {
        return {
          height: 5538968,
          // timestamp: 1686943148351
          timestamp: 1686943148,
          // "genesis_timestamp": "1676484704",
          // "genesis_height": "3792619"
        };
      } else {
        // testnet
        return {
          height: 6037839,
          // timestamp: 1686785347000
          timestamp: 1686785347,
        };
        // "genesis_timestamp": "1657555200",
        // "genesis_height": "2738748"
      }
    }

    if (chainName === 'injective') {
      if (process.env.NETWORK === 'mainnet') {
        return {
          height: 39864742,
          // timestamp: 1690386412736
          timestamp: 1690386412,
        };
      } else {
        // testnet
        return {
          height: 13824322,
          // timestamp: 1689894487535
          timestamp: 1689894487,
        };
      }
    }
  };

  static getContractAddress(chainName: string, contract: keyof ContractAddresses) {
    return Environment.chain.contractAddress(contract, Environment.getChainId(chainName));
  }

  static getChainId(chainName: string) {
    const chainMetadata = Environment.chain.chainMetadata(chainName as ChainName);
    const chainId = chainMetadata[process.env.NETWORK];

    return chainId;
  }
}
