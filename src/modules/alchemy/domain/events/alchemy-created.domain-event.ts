import { DomainEvent, DomainEventProps } from '@libs/ddd';

export class AlchemyCreatedDomainEvent extends DomainEvent {
  readonly userId: string;

  constructor(props: DomainEventProps<AlchemyCreatedDomainEvent>) {
    super(props);
  }
}
