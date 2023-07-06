import { AggregateID, AggregateRoot } from '@libs/ddd';
import { ArgumentOutOfRangeException } from '@libs/exceptions';
import { Err, Ok, Result } from 'oxide.ts';
import { v4 } from 'uuid';
import { AlchemyCreatedDomainEvent } from './events/alchemy-created.domain-event';
import { AlchemyWalletNotEnoughBalanceError } from './alchemy.errors';

export interface CreateAlchemyWalletProps {
  userId: AggregateID;
}

export interface AlchemyWalletProps extends CreateAlchemyWalletProps {
  balance: number;
}

export class AlchemyEntity extends AggregateRoot<AlchemyWalletProps> {
  protected readonly _id: AggregateID;

  static create(create: CreateAlchemyWalletProps): AlchemyEntity {
    const id = v4();
    const props: AlchemyWalletProps = { ...create, balance: 0 };
    const wallet = new AlchemyEntity({ id, props });

    wallet.addEvent(
      new AlchemyCreatedDomainEvent({
        aggregateId: id,
        userId: create.userId,
      }),
    );

    return wallet;
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
        'Wallet balance cannot be less than 0',
      );
    }
  }
}
