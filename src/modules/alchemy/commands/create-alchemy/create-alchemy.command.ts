import { Command, CommandProps } from '@libs/ddd';

export class CreateAlchemyCommand extends Command {
  readonly userId: string;

  readonly email: string;

  readonly country: string;

  readonly postalCode: string;

  readonly street: string;

  constructor(props: CommandProps<CreateAlchemyCommand>) {
    super(props);

    this.userId = props.userId;
    this.email = props.email;
    this.country = props.country;
    this.postalCode = props.postalCode;
    this.street = props.street;
  }
}
