import { Inject, Injectable } from '@nestjs/common';
import { AlchemyWeb3, createAlchemyWeb3 } from '@alch/alchemy-web3';
import { AlchemyApiModuleOptions } from './interfaces';
import { ALCHEMY_API_MODULE_OPTIONS } from './alchemy.constants';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AlchemyWalletRepositoryPort } from '@modules/alchemy/database/alchemy-wallet.repository.port';
import { ALCHEMY_WALLET_REPOSITORY } from '@modules/alchemy/alchemy.di-tokens';
import { Err, Ok, Result } from 'oxide.ts';
import { AggregateID } from '@libs/ddd';
import { AlchemyWalletNotEnoughBalanceError } from '@modules/alchemy/domain/alchemy-wallet.errors';
import { AlchemyWalletEntity } from '@modules/alchemy/domain/alchemy-wallet.entity';
import { ConflictException } from '@libs/exceptions';
import { CreateAlchemyWalletCommand } from '@modules/alchemy/commands/create-alchemy-wallet/create-alchemy-wallet.command';

@Injectable()
export class AlchemyService {
  private readonly alchemyApiInstance: AlchemyWeb3;
  constructor(
    @Inject(ALCHEMY_API_MODULE_OPTIONS)
    private readonly options: AlchemyApiModuleOptions,
    @Inject(ALCHEMY_WALLET_REPOSITORY)
    protected readonly alchemyWalletRepo: AlchemyWalletRepositoryPort,
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

@CommandHandler(CreateAlchemyWalletCommand)
export class CreateAlchemyWalletService implements ICommandHandler {
  constructor(
    @Inject(ALCHEMY_WALLET_REPOSITORY)
    protected readonly alchemyWalletRepo: AlchemyWalletRepositoryPort,
  ) {}

  async execute(
    command: CreateAlchemyWalletCommand,
  ): Promise<Result<AggregateID, AlchemyWalletNotEnoughBalanceError>> {
    const alchemyWallet = AlchemyWalletEntity.create({
      userId: command.userId,
    });

    try {
      /* Wrapping operation in a transaction to make sure
         that all domain events are processed atomically */
      await this.alchemyWalletRepo.transaction(async () =>
        this.alchemyWalletRepo.insert(alchemyWallet),
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
