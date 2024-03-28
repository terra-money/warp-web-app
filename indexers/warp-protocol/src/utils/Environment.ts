import dotenv from 'dotenv';
import { Epoch } from '@apps-shared/indexers/types';
import { ChainModule, ChainName, ContractAddresses, NetworkName } from '@terra-money/warp-sdk';
import { LCDClient } from '@terra-money/feather.js';

dotenv.config();

export class Environment {
  public static lcd: LCDClient;
  public static chain: ChainModule;

  static load() {
    dotenv.config();

    let lcdClientConfig = ChainModule.lcdClientConfig([process.env.NETWORK as NetworkName]);

    // override to private lcd with uncapped rate limiting
    if (process.env.NETWORK === 'mainnet') {
      lcdClientConfig['phoenix-1'].lcd = 'http://rpc-lcd.phoenix-1.internal:1317';
    }

    Environment.lcd = new LCDClient(lcdClientConfig);
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
          // height: 39864742,
          // // timestamp: 1690386412736
          // timestamp: 1690386412,
          height: 40585350,
          timestamp: 1691010500,
        };
      } else {
        // testnet
        return {
          height: 14834209,
          // timestamp: 1689894487535
          timestamp: 1689894487,
        };
      }
    }

    if (chainName === 'neutron') {
      if (process.env.NETWORK === 'mainnet') {
        return {
          height: 2556383,
          timestamp: 1693231160,
        };
      } else {
        // testnet
        return {
          height: 4219391,
          timestamp: 1692910321,
        };
      }
    }

    if (chainName === 'osmosis') {
      if (process.env.NETWORK === 'mainnet') {
        return {
          height: 14266867,
          timestamp: 1710262192,
        };
      } else {
        // testnet (this is mainnet, switch with testnet data when testnet is added)
        return {
          height: 14266867,
          timestamp: 1710262192,
        };
      }
    }

    if (chainName === 'archway') {
      // this is testnet, switch with mainnet data when deployed
      if (process.env.NETWORK === 'mainnet') {
        return {
          height: 3905130,
          timestamp: 1711632224,
        };
      } else {
        return {
          height: 5159503,
          timestamp: 1711559554,
        };
      }
    }

    // if (chainName === 'migaloo') {
    //   if (process.env.NETWORK === 'testnet') {
    //     // testnet
    //     return {
    //       height: 4415456,
    //       timestamp: 1699648200,
    //     };
    //   }
    // }
  };

  static getContractAddress(chainName: string, contract: keyof ContractAddresses) {
    return ChainModule.contractAddress(contract, Environment.getChainId(chainName));
  }

  static getChainId(chainName: string) {
    const chainMetadata = ChainModule.chainMetadata(chainName as ChainName);
    const chainId = chainMetadata[process.env.NETWORK];

    return chainId;
  }
}
