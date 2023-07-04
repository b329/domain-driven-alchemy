import { Inject, Injectable } from '@nestjs/common';
import { AlchemyWeb3, createAlchemyWeb3 } from '@alch/alchemy-web3';
import { AlchemyApiModuleOptions } from './interfaces';
import { ALCHEMY_API_MODULE_OPTIONS } from './alchemy-api.constants';

@Injectable()
export class AlchemyApiService {
  private readonly alchemyApiInstance: AlchemyWeb3;
  constructor(
    @Inject(ALCHEMY_API_MODULE_OPTIONS)
    private readonly options: AlchemyApiModuleOptions,
  ) {
    const { alchemyUrl, ...alchemyWeb3Config } = this.options;

    this.alchemyApiInstance = createAlchemyWeb3(alchemyUrl, alchemyWeb3Config);
  }

  /**
   * Returns raw Alchemy API Client instance.
   */
  get client() {
    return this.alchemyApiInstance;
  }
}
