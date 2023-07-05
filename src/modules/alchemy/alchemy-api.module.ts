import { Module, DynamicModule, Logger, Provider } from '@nestjs/common';
import { AlchemyApiService } from './alchemy-api.service';
import { ALCHEMY_API_MODULE_OPTIONS } from './alchemy-api.constants';
import { AlchemyApiModuleOptions } from './interfaces';
import { CreateAlchemyWalletWhenUserIsCreatedDomainEventHandler } from '@modules/alchemy/application/event-handlers/create-alchemy-wallet-when-wallet-is-created.domain-event-handler';
import { AlchemyWalletMapper } from '@modules/alchemy/alchemy-wallet.mapper';
import { ALCHEMY_WALLET_REPOSITORY } from '@modules/alchemy/alchemy-wallet.di-tokens';
import { AlchemyWalletRepository } from '@modules/alchemy/database/alchemy-wallet.repository';

const eventHandlers: Provider[] = [
  CreateAlchemyWalletWhenUserIsCreatedDomainEventHandler,
];

const mappers: Provider[] = [AlchemyWalletMapper];

const repositories: Provider[] = [
  { provide: ALCHEMY_WALLET_REPOSITORY, useClass: AlchemyWalletRepository },
];

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
        ...eventHandlers,
        ...mappers,
        ...repositories,
      ],
    };
  }
}
