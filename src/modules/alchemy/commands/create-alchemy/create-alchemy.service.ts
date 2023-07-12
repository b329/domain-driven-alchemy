import { AlchemyRepositoryPort } from '@modules/alchemy/database/alchemy.repository.port';
import { Address } from '@modules/alchemy/domain/value-objects/address.value-object';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Err, Ok, Result } from 'oxide.ts';
import { CreateAlchemyCommand } from './create-alchemy.command';
import { UserAlreadyExistsError } from '@modules/user/domain/user.errors';
import { AggregateID } from '@libs/ddd';
import { AlchemyEntity } from '@modules/alchemy/domain/alchemy.entity';
import { ConflictException } from '@libs/exceptions';
import { Inject } from '@nestjs/common';
import { ALCHEMY_REPOSITORY } from '../../alchemy.di-tokens';

@CommandHandler(CreateAlchemyCommand)
export class CreateAlchemyService implements ICommandHandler {
  constructor(
    @Inject(ALCHEMY_REPOSITORY)
    protected readonly alchemyRepo: AlchemyRepositoryPort,
  ) {}

  async execute(
    command: CreateAlchemyCommand,
  ): Promise<Result<AggregateID, UserAlreadyExistsError>> {
    const alchemy = AlchemyEntity.create({
      userId: '',
      balance: 0,
      email: command.email,
      address: new Address({
        country: command.country,
        postalCode: command.postalCode,
        street: command.street,
      }),
    });

    try {
      /* Wrapping operation in a transaction to make sure
               that all domain events are processed atomically */
      await this.alchemyRepo.transaction(async () =>
        this.alchemyRepo.insert(alchemy),
      );
      return Ok(alchemy.id);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new UserAlreadyExistsError(error));
      }
      throw error;
    }
  }
}
