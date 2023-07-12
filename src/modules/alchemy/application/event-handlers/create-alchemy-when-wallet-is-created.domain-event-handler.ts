import { AlchemyRepositoryPort } from '@modules/alchemy/database/alchemy.repository.port';
import { AlchemyEntity } from '../../domain/alchemy.entity';
import { OnEvent } from '@nestjs/event-emitter';
import { Inject, Injectable } from '@nestjs/common';
import { ALCHEMY_REPOSITORY } from '../../alchemy.di-tokens';
import { AlchemyCreatedDomainEvent } from '@modules/alchemy/domain/events/alchemy-created.domain-event';

@Injectable()
export class CreateAlchemyWalletWhenUserIsCreatedDomainEventHandler {
  constructor(
    @Inject(ALCHEMY_REPOSITORY)
    private readonly alchemyRepo: AlchemyRepositoryPort,
  ) {}

  // Handle a Domain Event by performing changes to other aggregates (inside the same Domain).
  // @OnEvent(AlchemyCreatedDomainEvent.name, { async: true, promisify: true })
  // async handle(event: AlchemyCreatedDomainEvent): Promise<any> {
  //   const alchemy = AlchemyEntity.create({
  //     userId: event.aggregateId,
  //   });
  //   return this.alchemyRepo.insert(alchemy);
  // }
}
