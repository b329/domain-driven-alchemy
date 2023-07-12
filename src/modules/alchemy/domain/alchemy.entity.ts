import { AggregateID, AggregateRoot } from '@libs/ddd';
import { ArgumentOutOfRangeException } from '@libs/exceptions';
import { Err, Ok, Result } from 'oxide.ts';
import { v4 } from 'uuid';
import { AlchemyCreatedDomainEvent } from './events/alchemy-created.domain-event';
import { AlchemyWalletNotEnoughBalanceError } from './alchemy.errors';
import {
  CreateAlchemyProps,
  AlchemyProps,
  AlchemyRoles,
} from '@modules/alchemy/domain/alchemy.types';

export class AlchemyEntity extends AggregateRoot<AlchemyProps> {
  protected readonly _id: AggregateID;

  static create(create: CreateAlchemyProps): AlchemyEntity {
    const id = v4();
    const props: AlchemyProps = { ...create, role: AlchemyRoles.guest };
    const alchemy = new AlchemyEntity({ id, props });

    alchemy.addEvent(
      new AlchemyCreatedDomainEvent({
        userId: create.userId,
        aggregateId: id,
        email: props.email,
        ...props.address.unpack(),
      }),
    );

    return alchemy;
  }

  deposit(amount: number): void {
    this.props.balance += amount;
  }

  withdraw(amount: number): Result<null, AlchemyWalletNotEnoughBalanceError> {
    if (this.props.balance - amount < 0) {
      return Err(new AlchemyWalletNotEnoughBalanceError());
    }
    this.props.balance -= amount;
    return Ok(null);
  }

  /**
   * Protects wallet invariant.
   * This method is executed by a repository
   * before saving entity in a database.
   */
  public validate(): void {
    if (this.props.balance < 0) {
      throw new ArgumentOutOfRangeException(
        'Alchemy balance cannot be less than 0',
      );
    }
  }
}
