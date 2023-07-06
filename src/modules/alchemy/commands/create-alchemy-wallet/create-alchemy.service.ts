import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Err, Ok, Result } from 'oxide.ts';
import { CreateAlchemyCommand } from './create-alchemy.command';
import { AggregateID } from '@libs/ddd';
import { AlchemyEntity } from '@modules/alchemy/domain/alchemy.entity';
import { ConflictException } from '@libs/exceptions';
import { Inject } from '@nestjs/common';
import { ALCHEMY_REPOSITORY } from '../../alchemy.di-tokens';
import { AlchemyRepositoryPort } from '@modules/alchemy/database/alchemy.repository.port';

@CommandHandler(CreateAlchemyCommand)
export class CreateAlchemyService implements ICommandHandler {
  constructor(
    @Inject(ALCHEMY_REPOSITORY)
    protected readonly alchemyRepo: AlchemyRepositoryPort,
  ) {}

  async execute(
    command: CreateAlchemyCommand,
  ): Promise<Result<AggregateID, any>> {
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
        return Err(error);
      }
      throw error;
    }
  }
}
