import { DomainEvent, DomainEventProps } from '@libs/ddd';

export class AlchemyCreatedDomainEvent extends DomainEvent {
  readonly userId: string;
  readonly email: string;

  readonly country: string;

  readonly postalCode: string;

  readonly street: string;

  constructor(props: DomainEventProps<AlchemyCreatedDomainEvent>) {
    super(props);
    this.userId = props.userId;
    this.email = props.email;
    this.country = props.country;
    this.postalCode = props.postalCode;
    this.street = props.street;
  }
}