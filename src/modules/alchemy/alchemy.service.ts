import { Inject, Injectable } from '@nestjs/common';
import { AlchemyWeb3, createAlchemyWeb3 } from '@alch/alchemy-web3';
import { AlchemyApiModuleOptions } from './interfaces';
import { ALCHEMY_API_MODULE_OPTIONS } from './alchemy.constants';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AlchemyRepositoryPort } from '@modules/alchemy/database/alchemy.repository.port';
import { ALCHEMY_REPOSITORY } from '@modules/alchemy/alchemy.di-tokens';
import { Err, Ok, Result } from 'oxide.ts';
import { AggregateID } from '@libs/ddd';
import { AlchemyWalletNotEnoughBalanceError } from '@modules/alchemy/domain/alchemy.errors';
import { AlchemyEntity } from '@modules/alchemy/domain/alchemy.entity';
import { ConflictException } from '@libs/exceptions';
import { CreateAlchemyCommand } from '@modules/alchemy/commands/create-alchemy-wallet/create-alchemy.command';

@Injectable()
export class AlchemyService {
  private readonly alchemyApiInstance: AlchemyWeb3;
  constructor(
    @Inject(ALCHEMY_API_MODULE_OPTIONS)
    private readonly options: AlchemyApiModuleOptions,
    @Inject(ALCHEMY_REPOSITORY)
    protected readonly alchemyRepo: AlchemyRepositoryPort,
  ) {
    const { alchemyUrl, ...alchemyWeb3Config } = this.options;

    this.alchemyApiInstance = createAlchemyWeb3(alchemyUrl, alchemyWeb3Config);
  }

  /**
   * Returns raw Alchemy API Client instance.
   */
  private get client() {
    return this.alchemyApiInstance;
  }
}

@CommandHandler(CreateAlchemyCommand)
export class CreateAlchemyWalletService implements ICommandHandler {
  constructor(
    @Inject(ALCHEMY_REPOSITORY)
    protected readonly alchemyRepo: AlchemyRepositoryPort,
  ) {}

  async execute(
    command: CreateAlchemyCommand,
  ): Promise<Result<AggregateID, AlchemyWalletNotEnoughBalanceError>> {
    const alchemyWallet = AlchemyEntity.create({
      userId: command.userId,
    });

    try {
      /* Wrapping operation in a transaction to make sure
         that all domain events are processed atomically */
      await this.alchemyRepo.transaction(async () =>
        this.alchemyRepo.insert(alchemyWallet),
      );
      return Ok(alchemyWallet.id);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new AlchemyWalletNotEnoughBalanceError(error));
      }
      throw error;
    }
  }
}
