import { Module, Logger, Provider } from '@nestjs/common';
import { CreateAlchemyWalletWhenUserIsCreatedDomainEventHandler } from '@modules/alchemy/application/event-handlers/create-alchemy-when-wallet-is-created.domain-event-handler';
import { AlchemyRepository } from '@modules/alchemy/database/alchemy.repository';
import { ALCHEMY_REPOSITORY } from '@modules/alchemy/alchemy.di-tokens';
import { AlchemyMapper } from '@modules/alchemy/alchemy.mapper';

const eventHandlers: Provider[] = [
  CreateAlchemyWalletWhenUserIsCreatedDomainEventHandler,
];

// const commandHandlers: Provider[] = [CreateAlchemyWalletService];

const mappers: Provider[] = [AlchemyMapper];

const repositories: Provider[] = [
  { provide: ALCHEMY_REPOSITORY, useClass: AlchemyRepository },
];

@Module({
  imports: [],
  controllers: [],
  providers: [
    Logger,
    ...eventHandlers,
    ...mappers,
    ...repositories,
    // ...commandHandlers,
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
