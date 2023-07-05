import { DomainEvent, DomainEventProps } from '@libs/ddd';

export class AlchemyWalletCreatedDomainEvent extends DomainEvent {
  readonly userId: string;

  constructor(props: DomainEventProps<AlchemyWalletCreatedDomainEvent>) {
    super(props);
  }
}
