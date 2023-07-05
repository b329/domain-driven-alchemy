import { Command, CommandProps } from '@libs/ddd';

export class CreateAlchemyWalletCommand extends Command {
  readonly userId: string;

  constructor(props: CommandProps<CreateAlchemyWalletCommand>) {
    super(props);
    this.userId = props.userId;
  }
}
