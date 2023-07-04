import { createAlchemyWeb3 } from '@alch/alchemy-web3';

type AlchemyWeb3Config = Parameters<typeof createAlchemyWeb3>[1];

export type AlchemyApiModuleOptions = AlchemyWeb3Config & {
  /**
   * Alchemy API URL starts with https:// or wss://
   */
  alchemyUrl: string;
  /**
   * Set this module as global. (default: false)
   */
  isGlobal?: boolean;
}
