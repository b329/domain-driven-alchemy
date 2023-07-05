import { UserCreatedDomainEvent } from '@modules/user/domain/events/user-created.domain-event';
import { AlchemyWalletRepositoryPort } from '@modules/alchemy/database/alchemy-wallet.repository.port';
import { AlchemyWalletEntity } from '../../domain/alchemy-wallet.entity';
import { OnEvent } from '@nestjs/event-emitter';
import { Inject, Injectable } from '@nestjs/common';
import { ALCHEMY_WALLET_REPOSITORY } from '../../alchemy-wallet.di-tokens';

@Injectable()
export class CreateAlchemyWalletWhenUserIsCreatedDomainEventHandler {
  constructor(
    @Inject(ALCHEMY_WALLET_REPOSITORY)
    private readonly alchemyWalletRepo: AlchemyWalletRepositoryPort,
  ) {}

  // Handle a Domain Event by performing changes to other aggregates (inside the same Domain).
  @OnEvent(UserCreatedDomainEvent.name, { async: true, promisify: true })
  async handle(event: UserCreatedDomainEvent): Promise<any> {
    const wallet = AlchemyWalletEntity.create({
      userId: event.aggregateId,
    });
    return this.alchemyWalletRepo.insert(wallet);
  }
}
