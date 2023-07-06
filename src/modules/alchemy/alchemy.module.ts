import { Module, Logger, Provider } from '@nestjs/common';
import { CreateAlchemyWalletService } from './alchemy.service';
// import { ALCHEMY_API_MODULE_OPTIONS } from './alchemy-api.constants';
// import { AlchemyApiModuleOptions } from './interfaces';
// import { CreateAlchemyWalletWhenUserIsCreatedDomainEventHandler } from '@modules/alchemy/application/event-handlers/create-alchemy-wallet-when-wallet-is-created.domain-event-handler';
import { AlchemyMapper } from '@modules/alchemy/alchemy.mapper';
import { ALCHEMY_WALLET_REPOSITORY } from '@modules/alchemy/alchemy.di-tokens';
import { AlchemyWalletRepository } from '@modules/alchemy/database/alchemy-wallet.repository';
import { CreateAlchemyWalletHttpController } from '@modules/alchemy/commands/create-alchemy-wallet/create-alchemy-wallet.http.controller';
import { CqrsModule } from '@nestjs/cqrs';

const httpControllers = [CreateAlchemyWalletHttpController];

// const eventHandlers: Provider[] = [
//   CreateAlchemyWalletWhenUserIsCreatedDomainEventHandler,
// ];

const commandHandlers: Provider[] = [CreateAlchemyWalletService];

const mappers: Provider[] = [AlchemyMapper];

const repositories: Provider[] = [
  { provide: ALCHEMY_WALLET_REPOSITORY, useClass: AlchemyWalletRepository },
];

@Module({
  imports: [CqrsModule],
  controllers: [...httpControllers],
  providers: [
    Logger,
    // ...eventHandlers,
    ...repositories,
    ...commandHandlers,
    ...mappers,
  ],
})
export class AlchemyModule {}

// export class AlchemyApiModule {
//   static forRoot(options: AlchemyApiModuleOptions): DynamicModule {
//     return {
//       ...options,
//       module: AlchemyApiModule,
//       controllers: [...httpControllers],
//       exports: [AlchemyApiService, ALCHEMY_API_MODULE_OPTIONS],
//       global: options.isGlobal ?? false,
//       providers: [
//         {
//           provide: ALCHEMY_API_MODULE_OPTIONS,
//           useValue: options,
//         },
//         {
//           provide: AlchemyApiService,
//           useClass: AlchemyApiService,
//         },
//         Logger,
//         ...eventHandlers,
//         ...commandHandlers,
//         ...mappers,
//         ...repositories,
//       ],
//     };
//   }
// }
