import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Err, Ok, Result } from 'oxide.ts';
import { CreateAlchemyWalletCommand } from './create-alchemy-wallet.command';
import { AggregateID } from '@libs/ddd';
import { AlchemyWalletEntity } from '@modules/alchemy/domain/alchemy-wallet.entity';
import { ConflictException } from '@libs/exceptions';
import { Inject } from '@nestjs/common';
import { ALCHEMY_WALLET_REPOSITORY } from '../../alchemy-wallet.di-tokens';
import { AlchemyWalletRepositoryPort } from '@modules/alchemy/database/alchemy-wallet.repository.port';

@CommandHandler(CreateAlchemyWalletCommand)
export class CreateUserService implements ICommandHandler {
  constructor(
    @Inject(ALCHEMY_WALLET_REPOSITORY)
    protected readonly alchemyWalletRepo: AlchemyWalletRepositoryPort,
  ) {}

  async execute(
    command: CreateAlchemyWalletCommand,
  ): Promise<Result<AggregateID, any>> {
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
        return Err(error);
      }
      throw error;
    }
  }
}
