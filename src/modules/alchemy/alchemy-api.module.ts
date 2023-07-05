import { Module, DynamicModule, Logger } from '@nestjs/common';
import { AlchemyApiService } from './alchemy-api.service';
import { ALCHEMY_API_MODULE_OPTIONS } from './alchemy-api.constants';
import { AlchemyApiModuleOptions } from './interfaces';

@Module({})
export class AlchemyApiModule {
  static forRoot(options: AlchemyApiModuleOptions): DynamicModule {
    return {
      ...options,
      module: AlchemyApiModule,
      exports: [AlchemyApiService, ALCHEMY_API_MODULE_OPTIONS],
      global: options.isGlobal ?? false,
      providers: [
        {
          provide: ALCHEMY_API_MODULE_OPTIONS,
          useValue: options,
        },
        {
          provide: AlchemyApiService,
          useClass: AlchemyApiService,
        },
        Logger,
      ],
    };
  }
}
