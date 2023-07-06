import { UserCreatedDomainEvent } from '@modules/user/domain/events/user-created.domain-event';
import { AlchemyRepositoryPort } from '@modules/alchemy/database/alchemy.repository.port';
import { AlchemyEntity } from '../../domain/alchemy.entity';
import { OnEvent } from '@nestjs/event-emitter';
import { Inject, Injectable } from '@nestjs/common';
import { ALCHEMY_REPOSITORY } from '../../alchemy.di-tokens';

@Injectable()
export class CreateAlchemyWalletWhenUserIsCreatedDomainEventHandler {
  constructor(
    @Inject(ALCHEMY_REPOSITORY)
    private readonly alchemyRepo: AlchemyRepositoryPort,
  ) {}

  // Handle a Domain Event by performing changes to other aggregates (inside the same Domain).
  @OnEvent(UserCreatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: UserCreatedDomainEvent): Promise<any> {
    const wallet = AlchemyEntity.create({
      userId: event.aggregateId,
    });
    return this.alchemyRepo.insert(wallet);
  }
}
